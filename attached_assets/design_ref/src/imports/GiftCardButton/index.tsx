import svgPaths from "./svg-a9ccq5ltm0";
import { imgHome } from "./svg-6f696";

function Header() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-semibold items-center justify-between relative shrink-0 w-full whitespace-nowrap" data-name="Header">
      <p className="font-['IBM_Plex_Sans:SemiBold',sans-serif] leading-[1.2] relative shrink-0 text-[#0b0a0a] text-[18.902px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Recent Transaction
      </p>
      <p className="font-['Roboto:SemiBold',sans-serif] leading-[1.5] relative shrink-0 text-[12.601px] text-black text-right" style={{ fontVariationSettings: '"wdth" 100' }}>
        See All
      </p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[1.5] relative shrink-0 whitespace-nowrap">
      <p className="font-['Roboto:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#595f67] text-[12.601px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Deposit Giftcard
      </p>
      <p className="font-['Roboto:Medium',sans-serif] font-medium relative shrink-0 text-[#aaafb5] text-[11.026px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        February 24,2022
      </p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex gap-[12.601px] items-center left-[12.6px] top-[6.3px]">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute bottom-1/4 left-[20.83%] right-[20.83%] top-1/4" data-name="icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
            <path clipRule="evenodd" d={svgPaths.p247f1d00} fill="var(--fill-0, #1C1B1F)" fillRule="evenodd" id="icon" />
          </svg>
        </div>
      </div>
      <Frame12 />
    </div>
  );
}

function TransactionList() {
  return (
    <div className="bg-white h-[48.601px] relative rounded-[3.15px] shrink-0 w-full" data-name="Transaction List">
      <Frame13 />
      <p className="-translate-x-full [word-break:break-word] absolute font-['Roboto:ExtraBold',sans-serif] font-extrabold leading-[1.5] left-[352.35px] text-[#00b03c] text-[12.601px] text-right top-[14.8px] w-[143px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        ₦200,40.00
      </p>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[25.203px]" data-name="Mask Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.2026 25.2026">
        <g id="Mask Group">
          <mask height="26" id="mask0_1_703" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="26" x="0" y="0">
            <rect fill="var(--fill-0, #C4C4C4)" height="25.2026" id="Rectangle 885" rx="3.15033" width="25.2026" />
          </mask>
          <g mask="url(#mask0_1_703)">
            <path clipRule="evenodd" d={svgPaths.pdaf8600} fill="var(--fill-0, #0B0A0A)" fillRule="evenodd" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="bg-[#eefffe] col-1 ml-0 mt-0 relative rounded-[3.15px] row-1 size-[25.203px]" />
      <MaskGroup />
    </div>
  );
}

function Frame15() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[1.5] relative shrink-0 whitespace-nowrap">
      <p className="font-['Manrope:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#595f67] text-[12.601px]">Withdraws</p>
      <p className="font-['Manrope:Medium',sans-serif] font-medium relative shrink-0 text-[#aaafb5] text-[11.026px]">February 24,2022</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[12.601px] items-center relative shrink-0">
      <Group1 />
      <Frame15 />
    </div>
  );
}

function TransactionList1() {
  return (
    <div className="bg-white relative rounded-[3.15px] shrink-0 w-full" data-name="Transaction List">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[66.944px] items-center px-[12.601px] py-[6.301px] relative size-full">
          <Frame14 />
          <p className="[word-break:break-word] font-['Manrope:ExtraBold','Noto_Sans:Black',sans-serif] font-extrabold leading-[1.5] relative shrink-0 text-[12.601px] text-[red] text-right w-[146px]">₦400,000.00</p>
        </div>
      </div>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center px-[20px] py-[4px] relative shrink-0 w-[64px]" data-name="state-layer">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[12.5%_16.67%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-3px] mask-size-[24px_24px]" style={{ maskImage: `url("${imgHome}")` }} data-name="home">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 18">
            <path d={svgPaths.p2fb94400} fill="var(--fill-0, white)" id="home" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconContainer() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 w-[32px]" data-name="icon-container">
      <StateLayer />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center px-[20px] py-[4px] relative shrink-0 w-[64px]" data-name="state-layer">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[20%_0_10%_10%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2px_-4px] mask-size-[20px_20px]" style={{ maskImage: `url("${imgHome}")` }} data-name="add_card">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.6 16.8">
            <path d={svgPaths.p2116a300} fill="var(--fill-0, #1C1B1F)" id="add_card" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconContainer1() {
  return (
    <div className="bg-[#e8def8] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[16px] shrink-0" data-name="icon-container">
      <StateLayer1 />
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-center px-[20px] py-[4px] relative shrink-0 w-[64px]" data-name="state-layer">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute inset-[15%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-3px] mask-size-[20px_20px]" style={{ maskImage: `url("${imgHome}")` }} data-name="history">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8 16.8">
            <path d={svgPaths.p1a4f200} fill="var(--fill-0, white)" id="history" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconContainer2() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 w-[32px]" data-name="icon-container">
      <div className="absolute bg-[red] left-[22px] rounded-[100px] size-[6px] top-[4px]" data-name="Badge" />
      <StateLayer2 />
    </div>
  );
}

function RecentTransaction() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12.601px] h-[194px] items-start left-[calc(10%-18.3px)] top-[609px] w-[351px]" data-name="recent Transaction">
      <Header />
      <TransactionList />
      <TransactionList1 />
      <div className="bg-black h-[53px] relative rounded-[34px] shrink-0 w-full" data-name="navigation-bar">
        <div className="content-stretch flex gap-[8px] items-start px-[8px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center justify-center min-w-px pb-[16px] pt-[12px] relative" data-name="Segment 1">
            <IconContainer />
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center justify-center min-w-px pb-[16px] pt-[12px] relative" data-name="Segment 2">
            <IconContainer1 />
            <p className="[word-break:break-word] font-['Roboto:Medium',sans-serif] font-medium leading-[16px] min-w-full relative shrink-0 text-[#49454f] text-[12px] text-center tracking-[0.5px] w-[min-content]" style={{ fontVariationSettings: '"wdth" 100' }}>
              ​
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center justify-center min-w-px pb-[16px] pt-[12px] relative" data-name="Segment 3">
            <IconContainer2 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 whitespace-nowrap">
      <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] relative shrink-0 text-[15.752px] text-black text-center">50% OFF</p>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#0b0a0a] text-[12.601px]">Black friday deal</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[6.301px] items-start left-[12.6px] top-[12.6px]">
      <Frame2 />
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] w-[114.199px]">Get discount for every top up and payment</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute h-[88.769px] left-[153.58px] top-[8.66px] w-[91.696px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 91.6964 88.7686">
        <g id="Group 1124">
          <path d={svgPaths.p23255780} fill="var(--fill-0, #FFE0CF)" id="Vector 73" />
          <path d={svgPaths.p2918e80} fill="var(--fill-0, #D6E1FF)" id="Vector 74" />
          <path d={svgPaths.p37854900} fill="var(--fill-0, #D6E1FF)" id="Vector 75" />
          <path d={svgPaths.p1cdf5800} fill="var(--fill-0, #FFF2CF)" id="Vector 76" />
          <path d={svgPaths.p15467a00} fill="var(--fill-0, #FFE0CF)" id="Vector 72" />
          <path d={svgPaths.p7003200} fill="var(--fill-0, #FFE0CF)" id="Vector 71" />
          <path clipRule="evenodd" d={svgPaths.p15ef55f0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[97.66px] relative shrink-0 w-[263.84px]">
      <div className="absolute bg-[#d6e1ff] h-[97.66px] left-0 rounded-[3.15px] top-0 w-[263.84px]" />
      <Frame5 />
      <Group3 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col font-['Roboto:Bold',sans-serif] font-bold items-start relative shrink-0 whitespace-nowrap">
      <p className="leading-[1.2] relative shrink-0 text-[15.752px] text-black text-center" style={{ fontVariationSettings: '"wdth" 100' }}>
        50% OFF
      </p>
      <p className="leading-[1.5] relative shrink-0 text-[#0b0a0a] text-[12.601px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Summer special deal
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[6.301px] items-start left-[12.6px] top-[12.6px]">
      <Frame7 />
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#0b0a0a] text-[9.451px] w-[114.199px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`Get discount for every transaction this weekend `}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[97.66px] relative shrink-0 w-[263.84px]">
      <div className="absolute bg-[#fcb3c5] h-[97.66px] left-0 rounded-[3.15px] top-0 w-[263.84px]" />
      <Frame6 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 whitespace-nowrap">
      <p className="font-['Manrope:Bold',sans-serif] font-bold leading-[1.2] relative shrink-0 text-[15.752px] text-black text-center">50% OFF</p>
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#0b0a0a] text-[12.601px]">Black friday deal</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[6.301px] items-start left-[12.6px] top-[12.6px]">
      <Frame10 />
      <p className="font-['Manrope:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] w-[114.199px]">Get discount for every top up and payment</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute h-[88.769px] left-[153.58px] top-[8.66px] w-[91.696px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 91.6964 88.7686">
        <g id="Group 1124">
          <path d={svgPaths.p23a66c00} fill="var(--fill-0, #FFE0CF)" id="Vector 73" />
          <path d={svgPaths.p5961b00} fill="var(--fill-0, #D6E1FF)" id="Vector 74" />
          <path d={svgPaths.p11e33400} fill="var(--fill-0, #D6E1FF)" id="Vector 75" />
          <path d={svgPaths.p255dcf00} fill="var(--fill-0, #FFF2CF)" id="Vector 76" />
          <path d={svgPaths.p71a4dc0} fill="var(--fill-0, #FFE0CF)" id="Vector 72" />
          <path d={svgPaths.p29c8e800} fill="var(--fill-0, #FFE0CF)" id="Vector 71" />
          <path clipRule="evenodd" d={svgPaths.p15ef55f0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="h-[97.66px] relative shrink-0 w-[263.84px]">
      <div className="absolute bg-[#fff2cf] h-[97.66px] left-0 rounded-[3.15px] top-0 w-[263.84px]" />
      <Frame9 />
      <Group4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex gap-[6.301px] items-start left-[-254.39px] top-0">
      <Frame3 />
      <Frame1 />
      <Frame8 />
    </div>
  );
}

function Banner() {
  return (
    <div className="absolute h-[130px] left-[5px] top-[486px] w-[388px]" data-name="Banner">
      <Frame4 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <div className="relative shrink-0 size-[24px]" data-name="Icon">
        <div className="absolute bottom-1/4 left-[20.83%] right-[20.83%] top-1/4" data-name="icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
            <path clipRule="evenodd" d={svgPaths.p247f1d00} fill="var(--fill-0, #1C1B1F)" fillRule="evenodd" id="icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Gift Card
      </p>
    </div>
  );
}

function Group6() {
  return (
    <div className="relative shrink-0 size-[18.902px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="Group 1318">
          <circle cx="9.18774" cy="9.45108" fill="var(--fill-0, #BCE2FE)" id="Ellipse 32" r="6.30066" />
          <g id="Water Drop / 24 / Outline">
            <path d={svgPaths.p2b517700} fill="var(--fill-0, #0B0A0A)" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <Group6 />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Water
      </p>
    </div>
  );
}

function Thunder24Outline() {
  return (
    <div className="relative shrink-0 size-[18.902px]" data-name="Thunder / 24 / Outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g clipPath="url(#clip0_1_709)" id="Thunder / 24 / Outline">
          <path d={svgPaths.p1b0e45c0} fill="var(--fill-0, #FFF2CF)" id="Polygon 1" />
          <path d={svgPaths.p613f580} fill="var(--fill-0, #0B0A0A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_709">
            <rect fill="white" height="18.902" width="18.902" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[55.918px]">
      <Thunder24Outline />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Electricity
      </p>
    </div>
  );
}

function Tv24Outline() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[18.902px]" data-name="Tv / 24 / Outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="Tv / 24 / Outline">
          <rect fill="var(--fill-0, #FCB3C5)" height="8.6634" id="Rectangle 940" width="14.1765" x="2.36326" y="6.30046" />
          <path d={svgPaths.p180ce200} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Tv24Outline />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <Group5 />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Cable TV
      </p>
    </div>
  );
}

function Row() {
  return (
    <div className="absolute content-stretch flex h-[41.15px] items-start justify-between left-[12.6px] top-[28.95px] w-[320.797px]" data-name="Row 1">
      <Frame11 />
      <Frame16 />
      <Frame17 />
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <div className="overflow-clip relative shrink-0 size-[18.9px]" data-name="bar-chart">
        <div className="absolute inset-[12.5%]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.175 14.175">
            <path clipRule="evenodd" d={svgPaths.p28eeeb80} fill="var(--fill-0, #0C0C0C)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Rates
      </p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <div className="overflow-clip relative shrink-0 size-[18.9px]" data-name="list">
        <div className="absolute bottom-1/4 left-[16.67%] right-[16.67%] top-1/4" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.6 9.45">
            <path clipRule="evenodd" d={svgPaths.p2e94cc80} fill="var(--fill-0, #0B0A0A)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>{`Transaction `}</p>
    </div>
  );
}

function Money24Outline() {
  return (
    <div className="relative shrink-0 size-[18.902px]" data-name="money / 24 / Outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="money / 24 / Outline">
          <rect fill="var(--fill-0, #BCE2FE)" height="13.3889" id="Rectangle 941" width="13.3889" x="3.01917" y="3.93643" />
          <path d={svgPaths.p5d1c400} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[55.918px]">
      <Money24Outline />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>{`Bet Funding `}</p>
    </div>
  );
}

function Grid24Outline() {
  return (
    <div className="relative shrink-0 size-[18.902px]" data-name="grid / 24 / Outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="grid / 24 / Outline">
          <rect fill="var(--fill-0, #D6E1FF)" height="13.3889" id="Rectangle 941" width="13.3889" x="3.15065" y="3.93643" />
          <path d={svgPaths.p1b839780} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[3.15px] items-center relative shrink-0 w-[56.706px]">
      <Grid24Outline />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[#595f67] text-[9.451px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        More
      </p>
    </div>
  );
}

function Row1() {
  return (
    <div className="absolute content-stretch flex h-[36.052px] items-start justify-between left-[12.6px] top-[89px] w-[320.797px]" data-name="Row 2">
      <Frame19 />
      <Frame20 />
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] h-[154px] left-[calc(10%-13.3px)] rounded-[3.15px] top-[306px] w-[346px]" data-name="Menu">
      <Row />
      <Row1 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[calc(10%-13.3px)] top-[306px]">
      <Menu />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative shrink-0 size-[18.902px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="Group 1024">
          <circle cx="9.45098" cy="9.45098" id="Ellipse 17" r="8.6634" stroke="var(--stroke-0, white)" strokeWidth="1.57516" />
          <g id="Plus / 24 / Outline">
            <path d={svgPaths.p25268e00} fill="var(--fill-0, white)" id="Vector" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TopUp() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3.938px] items-center min-w-px relative" data-name="Top Up">
      <Group2 />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[9.451px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Fund Wallet
      </p>
    </div>
  );
}

function Pointer24Outline() {
  return (
    <div className="relative shrink-0 size-[18.902px]" data-name="pointer / 24 / Outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.902 18.902">
        <g id="pointer / 24 / Outline">
          <path d={svgPaths.p192d9c00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Send() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.725px] items-center min-w-px relative" data-name="Send">
      <Pointer24Outline />
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[9.451px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Send
      </p>
    </div>
  );
}

function Scan() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4.725px] items-center min-w-px relative" data-name="Scan">
      <div className="overflow-clip relative shrink-0 size-[18.902px]" data-name="money withdrawal / 24 / Outline">
        <div className="absolute inset-[8.33%_4.17%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3268 15.7516">
            <path d={svgPaths.p364132f0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Roboto:Bold',sans-serif] font-bold leading-[1.5] relative shrink-0 text-[9.451px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Withdraw
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[7.088px] items-center justify-center relative shrink-0 w-full">
      <TopUp />
      <Send />
      <Scan />
    </div>
  );
}

function MainAction() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[61px] items-start left-[calc(10%-18.3px)] px-[11.814px] py-[12.601px] rounded-[5px] top-[196px] w-[351px]" data-name="Main Action">
      <Frame />
    </div>
  );
}

function Top() {
  return (
    <div className="content-stretch flex flex-col gap-[1.575px] items-start relative shrink-0" data-name="Top">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[1.2] relative shrink-0 text-[#1c1c1c] text-[15.752px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Hi, Dove
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#595f67] text-[12.601px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Your available balance
      </p>
    </div>
  );
}

function Greeting() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex h-[53px] items-center justify-between left-[calc(10%-17.3px)] top-[118px] w-[350px] whitespace-nowrap" data-name="Greeting">
      <Top />
      <p className="font-['IBM_Plex_Sans:SemiBold',sans-serif] font-semibold leading-[1.2] relative shrink-0 text-[#0b0a0a] text-[18.902px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        ₦200,590.00
      </p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[8.928px] right-[10.95px] top-[13.65px] w-[52.502px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.5018 8.92769">
        <g id="Group">
          <g id="Battery">
            <rect height="8.13835" id="Border" opacity="0.35" rx="1.70643" stroke="var(--stroke-0, #121208)" strokeOpacity="0.6" strokeWidth="0.787582" width="16.5392" x="33.7355" y="0.395549" />
            <path d={svgPaths.p2fb094c0} fill="var(--fill-0, #121208)" fillOpacity="0.6" id="Cap" opacity="0.4" />
            <rect fill="var(--fill-0, #0B0B0B)" height="5.7756" id="Capacity" rx="1.05011" width="14.1765" x="34.9163" y="1.57721" />
          </g>
          <path d={svgPaths.p1bee1900} fill="var(--fill-0, #0B0B0B)" id="Wifi" />
          <path d={svgPaths.p14523480} fill="var(--fill-0, #0B0B0B)" id="Cellular Connection" />
        </g>
      </svg>
    </div>
  );
}

function BlackStatusBar() {
  return (
    <div className="absolute h-[46px] left-[5px] overflow-clip top-0 w-[388px]" data-name="Black - Status bar">
      <Group />
      <div className="absolute h-[16.539px] left-[16.54px] top-[9.45px] w-[42.529px]" data-name="Time">
        <p className="[word-break:break-word] absolute font-['Manrope:SemiBold',sans-serif] font-semibold leading-[0] left-0 right-0 text-[#0b0b0b] text-[8.68px] text-center top-[calc(50%-5.91px)] tracking-[-0.2205px]">
          <span className="leading-[9.925px]">9:4</span>
          <span className="leading-[9.925px]">1</span>
        </p>
      </div>
    </div>
  );
}

function BasicsPlus({ className }: { className?: string }) {
  return (
    <div className={className || "absolute left-[calc(100%+55px)] size-[24px] top-[616px]"} data-name="basics/plus">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Vector" />
      </svg>
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p27897200} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Vector" />
      </svg>
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p27897200} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

export default function GiftCardButton() {
  return (
    <div className="bg-white overflow-clip relative rounded-[20px] size-full" data-name="Gift card button">
      <RecentTransaction />
      <Banner />
      <div className="absolute flex h-[17.168px] items-center justify-center left-[calc(10%+15.41px)] top-[337.42px] w-[22.578px]">
        <div className="flex-none rotate-[-16.43deg]">
          <div className="h-[12px] relative w-[20px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
              <path d="M0 0H20V12H0V0Z" fill="var(--fill-0, #FFF2CF)" id="Rectangle 949" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[calc(10%+19.7px)] size-[16px] top-[396px]">
        <div className="absolute inset-[0_2.45%_9.55%_2.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2169 14.4721">
            <path d={svgPaths.p2adb7280} fill="var(--fill-0, #BCE2FE)" id="Star 1" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#fff2cf] h-[12px] left-[calc(40%-7.2px)] top-[399px] w-[11px]" />
      <Group7 />
      <MainAction />
      <Greeting />
      <BlackStatusBar />
      <div className="absolute inset-[12.44%_4.58%_84.74%_89.31%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <g id="Vector">
            <path d={svgPaths.pb47cd00} fill="var(--fill-0, #0D0D0D)" />
            <path d={svgPaths.p22791980} fill="var(--fill-0, #0D0D0D)" />
          </g>
        </svg>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['NIKEA:Regular',sans-serif] leading-[1.2] left-[calc(40%+39.8px)] not-italic text-[18.902px] text-black text-center top-[46px] whitespace-nowrap">aza</p>
      <div className="absolute bg-[rgba(35,35,35,0.63)] h-[989px] left-[-8px] rounded-[67px] top-[-68px] w-[401px]" />
      <div className="absolute bg-white h-[329px] left-0 rounded-[24px] top-[592px] w-[393px]" />
      <BasicsPlus />
      <div className="absolute flex inset-[71.36%_3.59%_24.66%_87.79%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(52.3124cqw,47.6876cqh)] rotate-[-47.65deg] w-[hypot(47.6876cqw,-52.3124cqh)]">
          <div className="relative size-full" data-name="basics/plus">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Vector" />
            </svg>
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p27897200} fill="var(--fill-0, white)" id="Vector" />
              </svg>
            </div>
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Vector" />
            </svg>
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p27897200} fill="var(--fill-0, black)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.5] left-[calc(10%+14.2px)] text-[13px] text-black text-center top-[657px] whitespace-nowrap">I want to?</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.5] left-[calc(10%+21.2px)] text-[13px] text-black text-center top-[752px] whitespace-nowrap">I want to?</p>
      <div className="absolute bg-[#fff2cf] h-[138px] left-[calc(10%-18.3px)] rounded-[15px] top-[689px] w-[166px]" />
      <div className="absolute bg-[#fcb3c5] h-[138px] left-[calc(50%+10.5px)] rounded-[15px] top-[689px] w-[165px]" />
      <div className="absolute left-[calc(10%-9.3px)] size-[32px] top-[711px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #A0A0A0)" id="Ellipse 59" r="16" />
        </svg>
      </div>
      <div className="absolute left-[calc(50%+20.5px)] size-[32px] top-[711px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #A0A0A0)" id="Ellipse 59" r="16" />
        </svg>
      </div>
      <div className="absolute left-[calc(10%-5.3px)] size-[24px] top-[715px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="var(--fill-0, #0D0D0D)" id="Ellipse 60" r="12" />
        </svg>
      </div>
      <div className="absolute left-[calc(50%+24.5px)] size-[24px] top-[715px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="var(--fill-0, #020202)" id="Ellipse 62" r="12" />
        </svg>
      </div>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.5] left-[calc(10%+22.7px)] text-[10px] text-black text-center top-[755px] whitespace-nowrap">Sell Gift Card</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold h-[15px] leading-[1.5] left-[calc(50%+20.5px)] text-[10px] text-black top-[755px] w-[115px]">{`Check Pending `}</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Regular',sans-serif] font-normal h-[37px] leading-[1.09] left-[calc(10%-9.3px)] text-[7px] text-black top-[771px] w-[115px]">Sell local and international gift cards easily and instantly on aza.</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Regular',sans-serif] font-normal h-[37px] leading-[1.09] left-[calc(50%+20.5px)] text-[7px] text-black top-[771px] w-[115px]">{`Check Status of Pending gift card sale. `}</p>
      <div className="absolute h-[12px] left-[calc(10%-0.3px)] top-[722px] w-[15px]" data-name="add_card">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 12">
          <path d={svgPaths.p21172b80} fill="var(--fill-0, white)" id="add_card" />
        </svg>
      </div>
      <div className="absolute h-[12px] left-[calc(50%+29.5px)] top-[722px] w-[15px]" data-name="add_card">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 12">
          <path d={svgPaths.p21172b80} fill="var(--fill-0, white)" id="add_card" />
        </svg>
      </div>
    </div>
  );
}