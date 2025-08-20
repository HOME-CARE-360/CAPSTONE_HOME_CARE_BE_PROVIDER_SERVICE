import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpsertAssetFromInspectionSchema = z.object({
    customerId: z.number().int().positive(),
    categoryId: z.number().int().positive(),
    brand: z.string().min(1),
    model: z.string().optional(),
    serialNo: z.string().optional(),
    year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    installedAt: z.coerce.date().optional(),
    lastServiceAt: z.coerce.date().optional(),
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'BROKEN', 'UNKNOWN']).optional(),
    images: z.array(z.string()).optional(),
    properties: z.record(z.any()).optional(),
    address: z.string().optional(),

    bookingId: z.number().int().positive(),
    staffId: z.number().int().positive(),
    measured: z.record(z.any()).optional(),
    notes: z.string().optional(),
    inspectionImages: z.array(z.string()).optional(),
});

export class UpsertAssetFromInspectionDto extends createZodDto(UpsertAssetFromInspectionSchema) { }

////////////////////////
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaClient) { }



    async upsertFromInspection(input: {
        customerId: number;
        categoryId: number;
        brand: string;
        model?: string;
        serialNo?: string;
        year?: number;
        installedAt?: Date;
        lastServiceAt?: Date;
        condition?: string;
        images?: string[];
        properties?: any;
        address?: string;

        bookingId: number;
        staffId: number;
        measured?: any;
        notes?: string;
        inspectionImages?: string[];
    }) {
        const {
            customerId, categoryId, brand, model, serialNo, year, installedAt, lastServiceAt,
            condition, images, properties, address,
            bookingId, staffId, measured, notes, inspectionImages
        } = input;

        const existing = await this.prisma.deviceAsset.findFirst({
            where: {
                customerId, brand,
                OR: [
                    { serialNo: serialNo ?? undefined },
                    { model: model ?? undefined },
                ],
            },
        });

        const asset = existing
            ? await this.prisma.deviceAsset.update({
                where: { id: existing.id },
                data: {
                    categoryId,
                    model,
                    serialNo,
                    year,
                    installedAt,
                    lastServiceAt,
                    condition: (condition as any) ?? undefined,
                    images,
                    properties,
                    address,
                },
            })
            : await this.prisma.deviceAsset.create({
                data: {
                    customerId, categoryId, brand, model, serialNo, year,
                    installedAt, lastServiceAt,
                    condition: (condition as any) ?? undefined,
                    images: images ?? [],
                    properties,
                    address,
                },
            });

        const inspection = await this.prisma.deviceInspection.create({
            data: {
                bookingId, staffId,
                assetId: asset.id,
                notes,
                images: inspectionImages ?? [],
                measured,
            },
        });

        return { asset, inspection };
    }

    async listCustomerAssets(customerId: number) {
        return this.prisma.deviceAsset.findMany({
            where: { customerId },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true, brand: true, model: true, serialNo: true, condition: true,
                category: { select: { id: true, name: true } },
                updatedAt: true,
            },
        });
    }
}
