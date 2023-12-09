export const Links = () => {
  return (
    <section className="fle w-full px-[25px] py-[12px]">
      <span className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[24px] font-bold">My Links :)</h3>
        <p className="text-[18px] font-bold">12</p>
      </span>
      <div className="flex flex-col gap-[12px] ">
        <Link />
        <Link />
        <AddMore />
      </div>
    </section>
  );
};

const Link = () => {
  return (
    <span className="flex flex-col db-border items-center py-[12px]  w-full">
      <h1 className="flex items-center text-[18px] font-semibold">
        <svg
          className="mr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="14"
          fill="none"
          viewBox="0 0 16 14"
        >
          <path
            fill="#000"
            d="M13.829 2.786a3.135 3.135 0 001.376-1.73 6.264 6.264 0 01-1.987.758A3.135 3.135 0 007.884 4.67a8.883 8.883 0 01-6.448-3.27 3.135 3.135 0 00.968 4.178 3.118 3.118 0 01-1.416-.392v.04a3.13 3.13 0 002.51 3.067c-.46.125-.944.144-1.413.054a3.135 3.135 0 002.923 2.173 6.277 6.277 0 01-3.886 1.339c-.25 0-.5-.014-.747-.043a8.856 8.856 0 004.796 1.406 8.842 8.842 0 008.902-8.903c0-.136-.003-.27-.01-.405a6.356 6.356 0 001.563-1.62c-.571.253-1.177.42-1.797.493z"
          ></path>
        </svg>
        Twitter
      </h1>
      <p className="text-[#18181880] text-[10px]">Verified on 12.09.23</p>
    </span>
  );
};

const AddMore = () => {
  return (
    <span className="flex flex-col db-border items-center justify-center py-[12px]  w-full h-[68px] add-more">
      <h1 className="flex items-center text-[18px] font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="mr-[8px]"
        >
          <path
            d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Add even more
      </h1>
    </span>
  );
};

export default Links;
