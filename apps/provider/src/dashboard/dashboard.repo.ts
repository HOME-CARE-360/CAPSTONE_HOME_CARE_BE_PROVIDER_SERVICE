import { Injectable } from "@nestjs/common";
import { BookingStatus, PaymentStatus, WithdrawalStatus } from "@prisma/client";
import { DashboardParamsType } from "libs/common/src/request-response-type/provider/dashboard/dashboard.model";
import { PrismaService } from "libs/common/src/services/prisma.service";
type SeriesPoint = { bucket: string; value: number };

function normalizeRange(start?: Date, end?: Date): { start: Date; end: Date } {
    const now = new Date();
    const e = end ?? now;
    const s = start ?? new Date(e.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { start: s, end: e };
}
function toDateTrunc(granularity: 'day' | 'week' | 'month') {
    if (granularity === 'day') return 'day';
    if (granularity === 'week') return 'week';
    return 'month';
}
@Injectable()
export class DashboardRepository {
    constructor(private readonly prismaService: PrismaService) { }






    async ensureProvider(providerId: number) {
        const sp = await this.prismaService.serviceProvider.findUnique({
            where: { id: providerId },
            select: { id: true, userId: true },
        });
        if (!sp) {
            throw new Error('ServiceProviderNotFound');
        }
        return sp;
    }


    async summary(providerId: number, start?: Date, end?: Date) {
        const { start: s, end: e } = normalizeRange(start, end);

        const bookingByStatus = await this.prismaService.booking.groupBy({
            by: ['status'],
            where: { providerId, createdAt: { gte: s, lte: e }, deletedAt: null },
            _count: true,
        });
        const bookingMap: Record<BookingStatus, number> = {
            PENDING: 0, CONFIRMED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0, WAIT_FOR_PAYMENT: 0,
        };
        bookingByStatus.forEach(b => (bookingMap[b.status] = b._count));

        const revenueAgg = await this.prismaService.transaction.aggregate({
            where: {
                status: PaymentStatus.PAID,
                createdAt: { gte: s, lte: e },
                booking: { providerId },
            },
            _sum: { amount: true },
            _count: true,
        });
        const revenueTotal = revenueAgg._sum.amount ?? 0;
        const paidCount = revenueAgg._count;

        const ratingAgg = await this.prismaService.review.aggregate({
            where: { Booking: { providerId }, createdAt: { gte: s, lte: e } },
            _avg: { rating: true },
            _count: { rating: true },
        });
        const ratingAvg = ratingAgg._avg.rating ?? 0;
        const ratingCount = ratingAgg._count.rating;

        const customers = await this.prismaService.booking.groupBy({
            by: ['customerId'],
            where: { providerId, createdAt: { gte: s, lte: e }, deletedAt: null },
            _count: true,
        });
        const uniqueCustomers = customers.length;
        const repeatCustomers = customers.filter(c => c._count > 1).length;

        // 5) ServiceRequest funnel by status
        const reqByStatus = await this.prismaService.serviceRequest.groupBy({
            by: ['status'],
            where: { providerId, createdAt: { gte: s, lte: e } },
            _count: true,
        });
        const reqMap: Record<string, number> = {};
        reqByStatus.forEach(r => (reqMap[r.status] = r._count));

        const convs = await this.prismaService.conversation.findMany({
            where: { providerId },
            select: { unreadByProvider: true },
        });
        const conversationsWithUnread = convs.filter(c => c.unreadByProvider > 0).length;
        const unreadTotal = convs.reduce((acc, c) => acc + c.unreadByProvider, 0);

        const sp = await this.ensureProvider(providerId);
        const wallet = await this.prismaService.wallet.findUnique({
            where: { userId: sp.userId },
            select: { balance: true },
        });
        const balance = wallet?.balance ?? 0;

        const withdrawAgg = await this.prismaService.withdrawalRequest.groupBy({
            by: ['status'],
            where: { userId: sp.userId, createdAt: { gte: s, lte: e } },
            _count: true,
            _sum: { amount: true },
        });
        const withdraw = withdrawAgg.reduce((acc, w) => {
            acc[w.status] = {
                count: w._count,
                amount: w._sum.amount ?? 0,
            };
            return acc;
        }, {} as Record<WithdrawalStatus, { count: number; amount: number }>);

        return {
            range: { start: s.toISOString(), end: e.toISOString() },
            bookings: {
                total: Object.values(bookingMap).reduce((a, b) => a + b, 0),
                byStatus: bookingMap,
            },
            revenue: { totalPaid: revenueTotal, paidCount },
            rating: { avg: ratingAvg, count: ratingCount },
            customers: { unique: uniqueCustomers, repeat: repeatCustomers },
            serviceRequests: reqMap,
            conversations: { conversationsWithUnread, unreadTotal },
            wallet: { balance },
            withdrawals: withdraw,
        };
    }


    async series(providerId: number, granularity: 'day' | 'week' | 'month', start?: Date, end?: Date) {
        const { start: s, end: e } = normalizeRange(start, end);
        const bucket = toDateTrunc(granularity);

        const revenueSeries = await this.prismaService.$queryRaw<SeriesPoint[]>`
      SELECT to_char(date_trunc(${bucket}::text, t."createdAt"), 'YYYY-MM-DD') AS bucket,
             COALESCE(SUM(t."amount"), 0)::float AS value
      FROM "Transaction" t
      JOIN "Booking" b ON b."id" = t."bookingId"
      WHERE t."status" = 'PAID'
        AND b."providerId" = ${providerId}
        AND t."createdAt" BETWEEN ${s} AND ${e}
      GROUP BY 1
      ORDER BY 1;
    `;

        const bookingSeries = await this.prismaService.$queryRaw<SeriesPoint[]>`
      SELECT to_char(date_trunc(${bucket}::text, b."createdAt"), 'YYYY-MM-DD') AS bucket,
             COUNT(*)::int AS value
      FROM "Booking" b
      WHERE b."providerId" = ${providerId}
        AND b."createdAt" BETWEEN ${s} AND ${e}
      GROUP BY 1
      ORDER BY 1;
    `;

        return { range: { start: s.toISOString(), end: e.toISOString() }, granularity, revenue: revenueSeries, bookings: bookingSeries };
    }


    async topServices(providerId: number, start?: Date, end?: Date, limit = 10) {
        const { start: s, end: e } = normalizeRange(start, end);


        const grouped = await this.prismaService.proposalItem.groupBy({
            by: ['serviceId'],
            where: {
                createdAt: { gte: s, lte: e },
                Proposal: { Booking: { providerId } },
            },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });

        const serviceIds = grouped.map(g => g.serviceId);
        const services = await this.prismaService.service.findMany({
            where: { id: { in: serviceIds } },
            select: { id: true, name: true, basePrice: true },
        });
        const dict = Object.fromEntries(services.map(s => [s.id, s]));
        return grouped.map(g => ({
            serviceId: g.serviceId,
            name: dict[g.serviceId]?.name ?? 'Unknown',
            basePrice: dict[g.serviceId]?.basePrice ?? null,
            quantity: g._sum.quantity ?? 0,
        }));
    }

    async getProviderStats(providerId: number, params: DashboardParamsType) {
        const [sum, ser, top] = await Promise.all([
            this.summary(providerId, params.startDate, params.endDate),
            this.series(providerId, params.granularity ?? 'day', params.startDate, params.endDate),
            this.topServices(providerId, params.startDate, params.endDate, 10),
        ]);
        return { ...sum, series: ser, topServices: top };
    }


}