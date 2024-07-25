import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { WishlistItem } from "@/types";

interface ItemTableProps{
    items: WishlistItem[];
}

export default function ItemTable({items}:ItemTableProps) {
    
    return (
        <Collapsible>
            <div className="flex flex-row justify-between">
                <h1><AssignmentIcon />Items</h1>
                <CollapsibleTrigger>
                    <ArrowDropDownIcon />
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <table
                    className="w-full border-collapse border-4 border-black"
                >
                    <thead>
                        <tr>
                            <th className="text-left border border-black">Name</th>
                            <th className="text-left border border-black">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td
                                    className="text-left border border-black"
                                >
                                    {item.name}
                                </td>
                                <td
                                    className="text-left border border-black"
                                >
                                    {item.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CollapsibleContent>
        </Collapsible>
    )
}