import { IconType } from "react-icons/lib";

type Props = {
    count: number;
    Icon: IconType
};

export const MetaInfo: React.FC<Props> = ({
    count, 
    Icon
}) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
        {
            count > 0 && (
                <p className="font-semibold text-default-400 text-l">{count}</p>
            )
        }
        <p className="text-default-400 text-xl hover:text-2xl easy-in duration-100"><Icon/></p>
    </div>
  )
}

