import svgPaths from "./svg-fe23w52bcg";

function Icon() {
  return (
    <div className="absolute h-[58.5px] left-[15px] top-px w-[36px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 58.5">
        <g id="Icon">
          <circle cx="18" cy="40.5" fill="var(--fill-0, #F79E1C)" id="Ellipse 3" r="18" transform="rotate(90 18 40.5)" />
          <circle cx="18" cy="18" fill="var(--fill-0, #EF1B22)" id="Ellipse 2" r="18" transform="rotate(90 18 18)" />
          <path d={svgPaths.p18992a00} fill="var(--fill-0, #F79E1C)" id="Intersect" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function PaymentMethod() {
  return (
    <div className="absolute h-[60px] left-[24px] overflow-clip top-[130px] w-[51px]" data-name="Payment Method">
      <Icon />
      <div className="absolute flex h-[60px] items-center justify-center left-0 top-0 w-[13px]">
        <div className="flex-none rotate-90">
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] lowercase not-italic relative text-[#262626] text-[11px] whitespace-nowrap">mastercard</p>
        </div>
      </div>
    </div>
  );
}

function Rfid() {
  return (
    <div className="absolute inset-[33.22%_76.2%_52.27%_11.75%]" data-name="RFID">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 30.4762">
        <g clipPath="url(#clip0_1_22)" id="RFID">
          <rect fill="var(--fill-0, #E9DCA5)" height="30.4762" id="Rectangle" rx="4.66667" width="40" />
          <path d={svgPaths.p1ce65900} id="Vector" stroke="var(--stroke-0, #262626)" strokeWidth="0.583333" />
          <path d={svgPaths.p3d5ac100} id="Vector_2" stroke="var(--stroke-0, #262626)" strokeWidth="0.583333" />
        </g>
        <defs>
          <clipPath id="clip0_1_22">
            <rect fill="white" height="30.4762" width="40" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Chips() {
  return (
    <div className="absolute flex items-center justify-center left-[132px] size-[34px] top-[162px]">
      <div className="flex-none rotate-90">
        <div className="relative size-[34px]" data-name="Chips">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
            <g id="Chips ">
              <path d={svgPaths.p11e84100} id="Vector" stroke="var(--stroke-0, #424242)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Card() {
  return (
    <div className="bg-[#f9f9f9] overflow-clip relative rounded-[12px] size-full" style={{ containerType: "size" }} data-name="Card 06">
      <PaymentMethod />
      <Rfid />
      <div className="absolute flex h-[93px] items-center justify-center left-[294px] top-[11px] w-[22px]">
        <div className="flex-none rotate-90">
          <p className="[word-break:break-word] capitalize font-['Gugi:Regular',sans-serif] h-[22px] leading-[normal] not-italic relative text-[#424242] text-[16px] tracking-[-0.32px] w-[93px]">PAYVORA</p>
        </div>
      </div>
      <Chips />
    </div>
  );
}