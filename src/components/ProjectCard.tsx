import { slugifyStr } from "@utils/slugify";

export interface Props {
  href: string;
  title: string;
  initDate?: Date;
  endDate?: Date;
  description?: string;
}

export default function Card({
  href,
  title,
  description,
  initDate,
  endDate,
}: Props) {
  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", options);
    // formattedDate.replace(",", "");
    return formattedDate;
  }

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        <h3 {...headerProps}>{title}</h3>
      </a>
      <>
        <div className="flex items-center space-x-2 opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`inline-block h-6 w-6 min-w-[1.375rem] scale-100 fill-skin-base`}
            aria-hidden="true"
          >
            <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
            <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
          </svg>

          {initDate && (
            <span className="text-base italic">
              {/* Format initDate to the format Jul - 2023 */}
              {formatDate(initDate)}

              {endDate ? ` - ${formatDate(endDate)}` : " - Present"}
            </span>
          )}
        </div>
      </>
      <p>{description}</p>
    </li>
  );
}
