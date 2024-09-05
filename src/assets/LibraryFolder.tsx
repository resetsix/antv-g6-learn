import { SVGProps, memo } from "react";
const LibraryFolder = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
		<path
			fill="#EBECF0"
			d="M1 3.867C1 2.836 1.784 2 2.75 2h3.288a1 1 0 0 1 .698.283L8.5 4H13a2 2 0 0 1 2 2v3.268a1.995 1.995 0 0 0-.177-.091A2 2 0 0 0 13 8h-1a2 2 0 0 0-1.732 1H10a2 2 0 0 0-2 2v3H2.75C1.784 14 1 13.164 1 12.133V3.867Z"
		/>
		<path fill="#EDF3FF" d="M12 10h1v5h-1v-5ZM10 11h1v4h-1v-4ZM15 12h-1v3h1v-3Z" />
		<path
			fill="#3574F0"
			fillRule="evenodd"
			d="M11 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1Zm1 0h1v5h-1v-5Zm-1 1h-1v4h1v-4Zm3 4h1v-3h-1v3Z"
			clipRule="evenodd"
		/>
		<path
			fill="#6C707E"
			d="M8.094 5H13a1 1 0 0 1 1 1v2.268A2 2 0 0 1 15 10V6a2 2 0 0 0-2-2H8.5L6.736 2.283A1 1 0 0 0 6.038 2H2.75C1.784 2 1 2.836 1 3.867v8.266C1 13.164 1.784 14 2.75 14H8v-1H2.75c-.354 0-.75-.326-.75-.867V3.867c0-.54.396-.867.75-.867h3.288l2.056 2Z"
		/>
	</svg>
);
const Memo = memo(LibraryFolder);
export default Memo;
