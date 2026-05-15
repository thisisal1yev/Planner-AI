export function PartnersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-20 text-center">
      <p className="text-primary mb-4 text-[11px] tracking-[0.14em] uppercase">Hamkorlar</p>
      <h1 className="mb-10 text-[clamp(36px,6vw,56px)] leading-[1.08] font-bold">
        Bizning hamkorlar
      </h1>

      <div className="flex flex-col gap-5">
        <div className="mx-auto grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-x-30">
          <img src="/partners/sg.png" width={200} height={200} alt="Partners" />
          <img src="/partners/united_logo.png" width={200} height={200} alt="Partners" />
          <img
            src="/partners/IT_PARK_UZBEKISTAN_logo.png"
            width={200}
            height={200}
            alt="Partners"
          />
        </div>

        <div className="mx-auto grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-30">
          <img src="/partners/fstu_logo.png" width={200} height={200} alt="Partners" />
          <img src="/partners/sc_logo.png" width={200} height={200} alt="Partners" />
        </div>
      </div>
    </div>
  )
}
