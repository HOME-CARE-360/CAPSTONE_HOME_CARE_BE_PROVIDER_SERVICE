export const OrderBy = {
    Asc: 'asc',
    Desc: 'desc',
} as const

export const SortBy = {
    Price: 'price',
    CreatedAt: 'createdAt',
    Discount: 'discount',
} as const
export const SortByServiceRequest = {
    PreferredDate: "preferredDate",
    CreatedAt: 'createdAt',
} as const
export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy]
export type SortByType = (typeof SortBy)[keyof typeof SortBy]
export type SortByServiceRequestType = (typeof SortByServiceRequest)[keyof typeof SortByServiceRequest]