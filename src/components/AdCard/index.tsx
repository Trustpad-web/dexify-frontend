export default function AdCard({image, title, description, color} : {
    image: string;
    title: string;
    description: string;
    color: string;
}) {
  return (
    <div className={"ad flex items-center gap-2 md:gap-5 px-2 md:px-[48px] rounded-[12px] py-3 md:py-0 h-fit md:h-[160px] overflow-hidden " + color}>
      <img
        src={image}
        alt="logo"
        className="w-[48px] md:w-[160px] rounded-[50%] border-[5px] md:border-[15px] border-[#fff] box-content"
      />
      <div className="flex flex-col gap-1 md:gap-3">
        <h3 className="title text-[#fff] text-[18px] md:text-[24px] font-bold">
          {title}
        </h3>

        <p className="text-[#fff] text-[12px] md:text-[16px] font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
