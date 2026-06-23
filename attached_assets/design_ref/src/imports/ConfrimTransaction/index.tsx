import svgPaths from "./svg-gm7kuq31oe";
import imgEllipse63 from "./3ac3f9b33bac3aa42bfc7b90b3c179bd1a123c57.png";
import imgEllipse65 from "./4791b2403c6fc16fcc81ff45743e2f25505dd6a2.png";
import imgDownload342 from "./77a457014897e5794eaaf4033cfd3e671adc153f.png";
import { imgDownload341 } from "./svg-guht8";

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

function BackArrow() {
  return (
    <div className="absolute bottom-[91.67%] left-[14px] overflow-clip top-[5.05%] w-[28px]" data-name="back_arrow">
      <div className="absolute inset-[10.93%_29.21%_10.89%_26.03%]" data-name="Vector">
        <div className="absolute inset-[-0.46%_-0.8%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.7314 22.0922">
            <path d={svgPaths.p31c95300} fill="var(--fill-0, #1E232C)" id="Vector" stroke="var(--stroke-0, #1E232C)" strokeWidth="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-center relative rounded-[100px] shrink-0 z-[2]" data-name="Title">
      <p className="[word-break:break-word] capitalize font-['Manrope:Medium',sans-serif] font-medium leading-[1.6] relative shrink-0 text-[#6c7278] text-[12px] tracking-[-0.24px] whitespace-nowrap">gift card image</p>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[calc(20%+3.4px)] top-[501px]" data-name="Mask group">
      <div className="absolute h-[78px] left-[calc(20%-5.6px)] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[9px_14px] mask-size-[45px_45px] top-[487px] w-[86px]" style={{ maskImage: `url("${imgDownload341}")` }} data-name="download (34) 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDownload342} />
      </div>
    </div>
  );
}

export default function ConfrimTransaction() {
  return (
    <div className="bg-white overflow-clip relative rounded-[20px] size-full" data-name="Confrim transaction">
      <BlackStatusBar />
      <BackArrow />
      <p className="-translate-x-1/2 [word-break:break-word] absolute capitalize font-['Manrope:ExtraBold',sans-serif] font-extrabold leading-[1.5] left-[calc(50%+0.5px)] text-[13px] text-black text-center top-[46px] whitespace-nowrap">{`Confirm transaction Details `}</p>
      <div className="absolute content-stretch flex flex-col gap-[2px] h-[70px] isolate items-start left-[calc(10%-17.3px)] top-[478px] w-[330px]" data-name="Input Field">
        <Title />
      </div>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.6] left-[calc(10%-18.3px)] text-[#6c7278] text-[12px] top-[115px] tracking-[0.24px] whitespace-nowrap">{`Date& Time`}</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.6] left-[calc(10%-17.3px)] text-[#6c7278] text-[12px] top-[189px] tracking-[0.24px] whitespace-nowrap">Gift Card Category</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.6] left-[20px] text-[#1b1b1b] text-[12px] top-[134px] tracking-[0.24px] whitespace-nowrap">Aug 06,2024 -6:17PM</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.6] left-[calc(10%-18.3px)] text-[#1b1b1b] text-[12px] top-[208px] tracking-[0.24px] whitespace-nowrap">Amazon</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.6] left-[20px] text-[#1b1b1b] text-[12px] top-[292px] tracking-[0.24px] whitespace-nowrap">Aug 06,2024 -6:17PM</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold',sans-serif] font-bold leading-[1.6] left-[calc(60%+30.2px)] text-[#1b1b1b] text-[12px] top-[189px] tracking-[0.24px] whitespace-nowrap">Australia Amazon</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Bold','Noto_Sans:Bold',sans-serif] font-bold leading-[1.6] left-[calc(80%+2.6px)] text-[#1b1b1b] text-[12px] top-[134px] tracking-[0.24px] whitespace-nowrap">₦200,040</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.6] left-[calc(10%-18.3px)] text-[#6c7278] text-[12px] top-[273px] tracking-[0.24px] whitespace-nowrap">Gift card Amount</p>
      <p className="-translate-x-full [word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium h-[19px] leading-[1.6] left-[calc(70%+96.9px)] text-[#6c7278] text-[12px] text-right top-[115px] tracking-[0.24px] w-[78px]">Total Amount</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[1.6] left-[calc(50%+10.5px)] text-[#6c7278] text-[12px] top-[166px] tracking-[0.24px] whitespace-nowrap">Gift card Type/sub-category</p>
      <div className="absolute left-[calc(10%-13.3px)] size-[49px] top-[499px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="49" src={imgEllipse63} width="49" />
      </div>
      <div className="absolute left-[calc(20%+1.4px)] size-[49px] top-[499px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="49" src={imgEllipse65} width="49" />
      </div>
      <div className="absolute left-[calc(10%-11.3px)] size-[45px] top-[501px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45 45">
          <circle cx="22.5" cy="22.5" fill="var(--fill-0, #BBBBBB)" id="Ellipse 64" r="22.5" />
        </svg>
      </div>
      <div className="absolute flex inset-[60.68%_85.8%_37.82%_10.94%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-1.23935cqw,98.7606cqh)] rotate-[0.72deg] w-[hypot(98.7606cqw,1.23935cqh)]">
          <div className="relative size-full" data-name="basics/plus">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Vector" />
            </svg>
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.49205 9.49205">
                <path d={svgPaths.p1e755e00} fill="var(--fill-0, white)" id="Vector" />
              </svg>
            </div>
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="Vector" />
            </svg>
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.49205 9.49205">
                <path d={svgPaths.p1e755e00} fill="var(--fill-0, black)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <MaskGroup />
      <div className="absolute bg-[#010101] h-[114px] left-[calc(10%-18.3px)] rounded-[10px] top-[610px] w-[351px]" />
      <div className="absolute h-0 left-[calc(10%+1.7px)] top-[667px] w-[311px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311 1">
            <line id="Line 30" stroke="var(--stroke-0, #E9E9E9)" x2="311" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[2.32] left-[calc(10%+1.7px)] text-[10px] text-white top-[641px] tracking-[-0.1px] whitespace-nowrap">Rate</p>
      <p className="[word-break:break-word] absolute font-['Manrope:Medium',sans-serif] font-medium leading-[2.32] left-[calc(10%+1.7px)] text-[10px] text-white top-[670px] tracking-[-0.1px] whitespace-nowrap">Total:</p>
      <p className="-translate-x-full [word-break:break-word] absolute font-['Manrope:ExtraBold','Noto_Sans:Black',sans-serif] font-extrabold h-[23px] leading-[2.32] left-[calc(70%+76.9px)] text-[15px] text-right text-white top-[670px] tracking-[-0.15px] w-[79px]">₦200,400</p>
      <p className="-translate-x-full [word-break:break-word] absolute font-['Manrope:ExtraBold','Noto_Sans:Black',sans-serif] font-extrabold h-[23px] leading-[2.32] left-[calc(70%+76.9px)] text-[10px] text-right text-white top-[641px] tracking-[-0.1px] w-[48px]">₦1200</p>
      <div className="absolute bg-black content-stretch flex gap-[10px] h-[48px] items-center justify-center left-[calc(10%-17.3px)] overflow-clip px-[24px] py-[10px] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(37,62,167,0.48),0px_0px_0px_1px_#375dfb] top-[772px] w-[350px]" data-name="Button">
        <p className="[word-break:break-word] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.14px] whitespace-nowrap">Submit Trade</p>
      </div>
      <div className="absolute h-0 left-[14px] top-[78px] w-[393px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 393 1">
            <line id="Line 29" stroke="var(--stroke-0, #D1D1D1)" x2="393" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[78px] w-[393px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 393 1">
            <line id="Line 29" stroke="var(--stroke-0, #D1D1D1)" x2="393" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}