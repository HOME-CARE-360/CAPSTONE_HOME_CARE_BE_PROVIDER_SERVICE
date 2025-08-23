export const OrderBy = {
    Asc: 'asc',
    Desc: 'desc',
} as const

export const SortBy = {
    Price: 'price',
    CreatedAt: 'createdAt',
    Discount: 'discount',
} as const
export const ReportSortBy = {
    CreatedAt: 'createdAt',

}
export const SortByWithDraw = {
    Amount: 'amount',
    CreatedAt: 'createdAt',
    ProcessedAt: 'processedAt'
} as const
export const SortByServiceItem = {
    Price: 'price',
    CreatedAt: 'createdAt',
} as const
export const SortByStaff = {
    CreatedAt: 'createdAt',
} as const
export const SortByServiceRequest = {
    PreferredDate: "preferredDate",
    CreatedAt: 'createdAt',
} as const
export type SortByServiceItemType = (typeof SortByServiceItem)[keyof typeof SortByServiceItem]
export type SortByWithDrawType = (typeof SortByWithDraw)[keyof typeof SortByWithDraw]
export type ReportSortByType = (typeof ReportSortBy)[keyof typeof ReportSortBy]
export type SortByStaffType = (typeof SortByStaff)[keyof typeof SortByStaff]
export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy]
export type SortByType = (typeof SortBy)[keyof typeof SortBy]
export type SortByServiceRequestType = (typeof SortByServiceRequest)[keyof typeof SortByServiceRequest]