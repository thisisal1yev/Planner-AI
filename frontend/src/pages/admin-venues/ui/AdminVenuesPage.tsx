import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Landmark,
  Trash2,
  Wifi,
  ParkingCircle,
  Volume2,
  Presentation,
  Star,
} from 'lucide-react'
import { venuesApi } from '@entities/venue'
import type { Venue } from '@entities/venue'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'
import { venueKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

function AmenityChip({
  active,
  icon: Icon,
  label,
}: {
  active: boolean
  icon: React.ElementType
  label: string
}) {
  if (!active) return null
  return (
    <span className="text-muted-foreground/60 bg-muted/40 border-border/50 inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px]">
      <Icon className="size-2.5" />
      {label}
    </span>
  )
}

export function AdminVenuesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: venueKeys.list({ page }),
    queryFn: () => venuesApi.list({ page, limit: 12 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => venuesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: venueKeys.all() }),
  })

  const venues = data?.data ?? []
  const filtered = search
    ? venues.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.city.toLowerCase().includes(search.toLowerCase())
      )
    : venues

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-foreground text-lg font-bold tracking-tight">Maydonlar</h1>
        {data?.meta && (
          <span className="text-muted-foreground/60 border-border bg-muted/30 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
            {data.meta.total} ta
          </span>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Nom yoki shahar bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-border focus:border-primary/40 placeholder:text-muted-foreground/40 h-9 w-full rounded-lg border pr-3 pl-8 text-[13px] transition-colors focus:outline-none"
        />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="border-border bg-card overflow-hidden rounded-xl border">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground/50 py-16 text-center text-[13px]">
                Maydonlar topilmadi
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-border/60 bg-muted/10 border-b">
                    <th className="text-muted-foreground/50 px-5 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase">
                      Maydon
                    </th>
                    <th className="text-muted-foreground/50 hidden px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase sm:table-cell">
                      Shahar
                    </th>
                    <th className="text-muted-foreground/50 hidden px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase md:table-cell">
                      Sig'im
                    </th>
                    <th className="text-muted-foreground/50 hidden px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase lg:table-cell">
                      Narx / kun
                    </th>
                    <th className="text-muted-foreground/50 hidden px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase xl:table-cell">
                      Imkoniyatlar
                    </th>
                    <th className="text-muted-foreground/50 hidden px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] uppercase md:table-cell">
                      Reyting
                    </th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((v: Venue) => (
                    <tr
                      key={v.id}
                      className="border-border/40 hover:bg-muted/15 group border-b transition-colors last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {v.imageUrls?.[0] ? (
                            <img
                              src={v.imageUrls[0]}
                              alt=""
                              className="border-border h-8 w-8 shrink-0 rounded-lg border object-cover"
                            />
                          ) : (
                            <div className="bg-primary/8 border-primary/12 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                              <Landmark className="text-primary/60 size-3.5" />
                            </div>
                          )}
                          <div>
                            <p className="text-foreground line-clamp-1 text-[13px] leading-none font-medium">
                              {v.name}
                            </p>
                            <p className="text-muted-foreground/50 mt-0.5 line-clamp-1 text-[11px]">
                              {v.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-foreground hidden px-4 py-3 text-xs sm:table-cell">
                        {v.city}
                      </td>
                      <td className="text-muted-foreground hidden px-4 py-3 text-xs md:table-cell">
                        {v.capacity.toLocaleString()} kishi
                      </td>

                      <td className="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">
                        {formatUZS(v.pricePerDay)}
                      </td>

                      <td className="hidden px-4 py-3 xl:table-cell">
                        <div className="flex flex-wrap items-center gap-1">
                          <AmenityChip active={!!v.hasWifi} icon={Wifi} label="Wi-Fi" />

                          <AmenityChip
                            active={!!v.hasParking}
                            icon={ParkingCircle}
                            label="Parking"
                          />
                          <AmenityChip active={!!v.hasSound} icon={Volume2} label="Sound" />
                          <AmenityChip active={!!v.hasStage} icon={Presentation} label="Sahna" />
                          {!v.hasWifi && !v.hasParking && !v.hasSound && !v.hasStage && (
                            <span className="text-muted-foreground/30 text-[11px]">—</span>
                          )}
                        </div>
                      </td>

                      <td className="mr-auto hidden px-4 py-3 md:table-cell">
                        {(v.ratingStats?.avg ?? 0 > 0) ? (
                          <span className="inline-flex items-center gap-1 fill-amber-400 text-xs text-amber-400">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {parseFloat((v.ratingStats?.avg ?? 0).toFixed(1))}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            if (window.confirm("Maydonni o'chirasizmi?"))
                              deleteMutation.mutate(v.id)
                          }}
                          disabled={deleteMutation.isPending}
                          className="flex h-7 items-center gap-1 rounded-md border border-red-500/20 bg-red-500/8 px-2.5 text-[11px] font-medium text-red-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/15 disabled:opacity-50"
                        >
                          <Trash2 className="size-3" />
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
