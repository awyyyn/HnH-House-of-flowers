import { ScrollArea } from "@/components";
import { BouquetItem } from "@/types";

interface PickThemeProps {
	selected: string;
	handleSelect: (id: string) => void;
	wrappers: BouquetItem[];
}

export default function PickTheme({
	handleSelect,
	selected,
	wrappers,
}: PickThemeProps) {
	return (
		<ScrollArea className="  md:min-h-[60dvh] max-h-[80dvh] md:min-w-[50%] xl:min-w-[50dvw] min-w-screen min-h-[50dvh]  overflow-y-auto  border p-5s scroll-p-5 rounded-lg">
			<div className="grid grid-cols-1 overflow-auto  gap-1 sm:grid-cols-2 md:grid-cols-3  lg:gap-5 auto-auto-flow p-5">
				{wrappers.map((wrapper, index) => (
					// <div
					// className="hover:shadow-md"
					// className={`  group overflow-hidden relative   p-2 border shadow-primary/40 cursor-pointer transition-all duration-500  rounded-xl ${
					// 	selected === wrapper.id
					// 		? "   border-primary/10 shadow-lg "
					// 		: "border-transparent  hover:border-primary/10 hover:shadow-lg "
					// }
					// 		min-h-[220px]
					// 	max-h-[220px]
					// `}
					// >
					//  <img
					// 	className={`group-hover:scale-105 scale-90 duration-700 transition-all h-[85%] w-full object-contain ${
					// 		selected === wrapper.id ? " scale-105 " : " "
					// 	}`}
					// 	src={wrapper.svg[0]}
					// 	alt={wrapper.name}
					// 	/>
					// 	<p className="p-2 ">{wrapper.name}</p> */
					// </div>
					<div
						onClick={() => {
							handleSelect(wrapper.id);
						}}
						key={`${wrapper.name}-${index}`}
						className={`relative flex  min-w-[350px] min-h-[350px]  hover:shadow-md transition-all overflow-hidden  rounded-xl bg-clip-content cursor-pointer duration-500 ${
							selected === wrapper.id ? "shadow-lg shadow-primary/30" : ""
						} `}>
						<div className="z-10 absolute left-[100px]  top-[62px]  ]">
							<div
								dangerouslySetInnerHTML={{
									// __html: prepareSvgForColorization(wrapper.svg[0]),
									__html: wrapper.svg[0],
								}}
							/>
						</div>
						<div className="z-40 absolute  left-[100px]  top-[82px]  ">
							<div
								dangerouslySetInnerHTML={{
									// __html: prepareSvgForColorization(wrapper.svg[0]),
									__html: wrapper.svg[1],
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
