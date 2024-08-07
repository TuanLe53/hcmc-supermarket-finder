import { Coordinate, LocationMarker, WishlistItem } from "@/types"
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

import MyLocationIcon from '@mui/icons-material/MyLocation';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import { useRouter } from "next/navigation";
import { getUserTrips } from "@/db/querys/wishlist";

interface PanelProps{
    selectedLocation: Coordinate | null;
    markers: LocationMarker[];
    markerType: "supermarket" | "wishlist" | "detail";
    setSelectedLocation: (args: Coordinate) => void;
    setFlyToLocation: (args: [number, number]) => void;
    setMarkerType: (args: "supermarket" | "wishlist" | "detail") => void;
    setMarkers: (args: LocationMarker[]) => void;
}

interface UserTripsProps extends PanelProps{
    setShowUserData: (args: boolean) => void;
    setSelectedMarker: (args: LocationMarker | null) => void;
    setItems: (args: WishlistItem[]) => void;
}

interface DialogProps {
    isDialogOpen: boolean;
    selectedMarker: LocationMarker | null;
    setDialogOpen: (args: boolean) => void;
    setSelectedMarker: (args: LocationMarker | null) => void;
}

interface DisplayItemsProps extends PanelProps{
    selectedMarker: LocationMarker | null;
    setSelectedMarker: (args: LocationMarker | null) => void;
    items: WishlistItem[];
    setItems: (args: WishlistItem[]) => void;
}

function CreateWishlistDialog({
    isDialogOpen,
    setDialogOpen,
    selectedMarker,
    setSelectedMarker
}: DialogProps
) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [newItem, setNewItem] = useState<WishlistItem>({
        name: "",
        quantity: ""
    });

    const { toast } = useToast();

    const closeDialog = () => {
        setNewItem({ name: "", quantity: "" });
        setItems([]);
        setSelectedMarker(null);
        setDialogOpen(false);
    }

    const addItem = () => {
        if (newItem.name === "" || newItem.quantity === "") return;

        setItems((prevItems) => [ newItem, ...prevItems]);
        setNewItem({ name: "", quantity: "" });
    }

    const createWishlist = async () => {
        if (items.length <= 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please add items to your wishlist before you create it."
            })
            return;
        }

        const body = {
            supermarket: selectedMarker?.id,
            items: items
        }
    
        const res = await fetch("/api/wishlists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (res.status !== 201) {
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "There was problem with your request."
            })
            return;
        }

        setItems([]);
        setSelectedMarker(null);
        setDialogOpen(false);
        toast({
            title: "Success",
            description: "Wishlist created"
        })
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent onInteractOutside={closeDialog}>
                <DialogHeader>
                    <DialogTitle>Create your wishlist</DialogTitle>
                    <DialogDescription>Add your desire items and their quantity</DialogDescription>
                </DialogHeader>
                <div>
                    {items.length > 0 &&                    
                        <ul className="max-h-60 overflow-y-scroll border-b-2 border-slate-800 border-dashed mb-2">
                            {items.map((item, index) => (
                                <li key={index} className="flex flex-row justify-between">
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                    }
                    <div className="flex flex-row items-end justify-between">
                        <div className="mr-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your product's name"
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            />
                        </div>
                        <div className="mr-1">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                placeholder="Please specify the quantity and unit"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                            />
                        </div>
                        <AddCircleIcon
                            fontSize="large"
                            className="hover:cursor-pointer text-sky-400 hover:text-sky-600"
                            onClick = {addItem}
                        />                            
                    </div>
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                        onClick={closeDialog}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        className="p-1 rounded-md bg-sky-400 hover:bg-sky-500"
                        onClick={createWishlist}
                    >
                        Create
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DisplayItems({
    markers,
    markerType,
    selectedMarker,
    setFlyToLocation,
    setMarkerType,
    setMarkers,
    setSelectedMarker,
    items,
    setItems
}: Pick<DisplayItemsProps, "markers" | "setFlyToLocation" | "markerType" | "setMarkerType" | "setMarkers" | "selectedMarker" | "setSelectedMarker" | "items" | "setItems">
) {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    const {toast} = useToast();
    const router = useRouter();

    const openDialog = (marker: LocationMarker) => {
        setSelectedMarker(marker)
        setDialogOpen(true)
    }

    const acceptWishlist = async () => {
        const res = await fetch(`/api/map/wishlists/${selectedMarker?.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        })
        const data = await res.json();

        if (res.status !== 200) {
            console.log(data.error)
        };

        toast({
            title: "Success",
            description: "Wishlist accepted"
        })

    }

    const getWishlistDetail = async (marker: LocationMarker) => {
        const res = await fetch(`api/map/wishlists/${marker.id}`);
        const data = await res.json();
        
        if (res.status !== 200) {
            console.log(data.error)
        }
        const wishlist = data.markers.filter((marker: LocationMarker) => marker.type === "wishlist")

        setSelectedMarker(wishlist[0])
        setMarkerType("detail")
        setMarkers(data.markers)
        setItems(data.items)
    }

    if (markerType === "supermarket") {
        return (
            <div className="h-5/6 overflow-y-scroll">
                {markers.map((marker, index) => (
                    <Card key={index} className="mb-1">
                        <CardHeader>
                            <CardTitle className="text-base cursor-pointer">
                                <div className="flex flex-row justify-between">
                                    <p
                                        onClick={() => setFlyToLocation([marker.location[0], marker.location[1]])}
                                    >
                                        {marker.name}
                                    </p>
                                    <AddCircleIcon
                                        fontSize="large"
                                        className="text-sky-400 hover:text-sky-600"
                                        onClick = {() => openDialog(marker)}
                                    />
                                </div>
                            </CardTitle>
                            <CardDescription>{marker.address}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
                <CreateWishlistDialog
                    isDialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedMarker={selectedMarker}
                    setSelectedMarker={setSelectedMarker}
                />
            </div>
        )
    } else if (markerType === "wishlist") {
        return (
            <div className="h-5/6 overflow-y-scroll">
                {markers.map((marker, index) => (
                    <Card key={index} className="mb-1">
                        <CardHeader>
                            <CardTitle className="text-base cursor-pointer">
                                <div className="flex flex-row justify-between">
                                    <p
                                        onClick={() => setFlyToLocation([marker.location[0], marker.location[1]])}
                                    >
                                        {marker.name}
                                    </p>
                                    <button
                                        onClick = {() => getWishlistDetail(marker)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </CardTitle>
                            <CardDescription>{marker.address}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    } else if (markerType === "detail") {
        return (
            <div className="h-5/6 overflow-y-scroll">
                <div className="flex flex-row justify-between items-center p-2">
                    <p
                        className="font-semibold text-xs"
                    >
                        {selectedMarker?.id}
                    </p>
                    {selectedMarker?.status === "pending" &&                    
                        <button
                            type="button"
                            className="p-1 rounded-md bg-sky-400 hover:bg-sky-500"
                            onClick={acceptWishlist}
                        >
                            Accept
                        </button>
                    }
                    {selectedMarker?.status === "accepted" &&
                        <button
                        type="button"
                        className="p-1 rounded-md bg-sky-400 hover:bg-sky-500"
                        onClick={() => router.push(`/trips/${selectedMarker.id}`)}
                        >
                            Details
                        </button>
                    }
                </div>
                {items.map((item, index) => (
                    <Card key={index} className="mb-1">
                        <CardHeader>
                            <CardTitle className="text-base cursor-pointer">
                                <div className="flex flex-row justify-between">
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    }
}

function UserTrips({
    setMarkers,
    setMarkerType,
    setShowUserData,
    setSelectedMarker,
    setItems
}: Pick<UserTripsProps, "setMarkers" | "setMarkerType" | "setShowUserData" | "setSelectedMarker" | "setItems">) {
    const [trips, setTrips] = useState<Awaited<ReturnType<typeof getUserTrips>>>([]);
    const router = useRouter();

    const handleClick = async (wishlistID: string) => {
        const res = await fetch(`api/map/wishlists/${wishlistID}`);
        const data = await res.json();

        if (res.status !== 200) {
            console.log(data.error)
        }
        const wishlist = data.markers.filter((marker: LocationMarker) => marker.type === "wishlist")

        setSelectedMarker(wishlist[0])
        setMarkers(data.markers);
        setMarkerType("detail");
        setShowUserData(false);
        setItems(data.items)
    };
    useEffect(() => {
        const getUserTrips = async () => {
            const res = await fetch("/api/trips");
            const data = await res.json();

            if (res.status !== 200) {
                alert("Something went wrong")
            }

            console.log(data.trips)
            setTrips(data.trips)
        }

        setMarkers([]);
        getUserTrips();
    }, [])
    return (
        <div>
            <button
                type="button"
                className="w-full flex justify-end"
                onClick={() => router.push("trips")}
            >
                <p className="text-sky-600 mr-3 hover:underline">
                    Details
                </p>
            </button>
            <ul>
                {trips.map((trip, index) => (
                    <li
                        key={index}
                        className="p-2 bg-slate-300 rounded-md m-2"
                    >
                        <p onClick={()=>handleClick(trip.id)}>{trip.owner}</p>
                        <p>{trip.supermarket}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function UserWishlist({ markers, setMarkers, setFlyToLocation }: Pick<PanelProps, "markers" | "setMarkers" | "setFlyToLocation">) {
    const router = useRouter();

    useEffect(() => {
        const getUserWishlist = async () => {
            const res = await fetch("/api/wishlists");
            const data = await res.json();

            if (res.status !== 200) {
                alert("Something went wrong")
            }

            setMarkers(data.wishlists);
        }
        
        getUserWishlist();
    },[])

    return (
        <div>
            <button
                type="button"
                className="w-full flex justify-end"
                onClick={() => router.push("/wishlists")}
            >
                <p className="text-sky-600 mr-3 hover:underline">
                    Details
                </p>
            </button>
            <ul>
                {markers.map((wishlist, index) => (
                    <li
                        key={index}
                        className="p-2 bg-slate-300 rounded-md m-2 hover:cursor-pointer"
                        onClick={() => setFlyToLocation([wishlist.location[0], wishlist.location[1]])}
                    >
                        <p>{wishlist.id}</p>
                        <p className="text-right">Status: {wishlist.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Panel({
    selectedLocation,
    markers,
    markerType,
    setSelectedLocation,
    setFlyToLocation,
    setMarkerType,
    setMarkers
}: PanelProps) {
    const [showUserData, setShowUserData] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);

    const [limit, setLimit] = useState<number>(10);
    const [searchingRadius, setSearchingRadius] = useState<number>(10000); //10km
    
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setSelectedLocation({
                lat: pos.coords.latitude,
                long: pos.coords.longitude
            })
            setFlyToLocation([pos.coords.longitude, pos.coords.latitude])
        },
            (error) => {
                alert(error.message)
            },
            {enableHighAccuracy: true}
        )
    }

    const getNearbySupermarkets = async () => {
        if (!selectedLocation) {
            alert("Please select a location first");
            return;
        }
        
        const res = await fetch(`/api/map/supermarkets?long=${selectedLocation.long}&lat=${selectedLocation.lat}&radius=${searchingRadius}&limit=${limit}`);
        const data = await res.json();
        
        if (res.status !== 200) {
            console.log(data.error)
        }
        setMarkerType("supermarket");
        setMarkers(data.supermarkets);
        setShowUserData(false);
    }

    const getNearbyWishlists = async () => {
        if (!selectedLocation) {
            alert("Please select a location first");
            return;
        }
        
        const res = await fetch(`/api/map/wishlists?long=${selectedLocation.long}&lat=${selectedLocation.lat}&radius=${searchingRadius}&limit=${limit}`);
        const data = await res.json();

        if (res.status !== 200) {
            console.log(data.error)
        }

        setMarkerType("wishlist");
        setMarkers(data.wishlists);
        setShowUserData(false);
    }

    return (
        <>
            <div className="p-1 border-b-2 border-slate-950">
                <div className="w-full flex flex-row justify-between">
                    <button
                        type="button"
                        title="Get nearby supermarkets"
                        className="p-1 hover:bg-slate-100"
                        onClick={getNearbySupermarkets}
                    >
                        <StoreIcon className="text-5xl" />
                        <p className="text-sm">Supermarkets</p>
                    </button>
                    <button
                        type="button"
                        title="Get nearby wishlists"
                        className="p-1 hover:bg-slate-100"
                        onClick={getNearbyWishlists}
                    >
                        <ShoppingCartIcon className="text-5xl" />
                        <p className="text-sm">Wishlists</p>
                    </button>
                    <button
                        type="button"
                        className="p-1 hover:bg-slate-100"
                        onClick={() => {
                            setMarkers([])
                            setMarkerType("detail")
                            setShowUserData(true)
                        }}
                    >
                        <AccountCircleIcon className="text-5xl" />
                        <p className="text-sm">Your profile</p>
                    </button>
                    <button title="Get your current location" className="p-1 hover:bg-slate-100" type="button" onClick={getCurrentLocation}>
                        <MyLocationIcon className="text-5xl" style={{ color: "red" }} />
                        <p className="text-sm">Your location</p>
                    </button>
                </div>
            </div>
            {showUserData === true
                ?
                <Tabs>
                    <TabsList className="w-full">
                        <TabsTrigger value="wishlists" className="w-3/6">My Wishlists</TabsTrigger>
                        <TabsTrigger value="trips" className="w-3/6">My Trips</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wishlists">
                        <UserWishlist markers={markers} setMarkers={setMarkers} setFlyToLocation={setFlyToLocation}/>
                    </TabsContent>
                    <TabsContent value="trips">
                        <UserTrips
                            setMarkers={setMarkers}
                            setMarkerType={setMarkerType}
                            setShowUserData={setShowUserData}
                            setSelectedMarker={setSelectedMarker}
                            setItems={setItems}
                        />
                    </TabsContent>
                </Tabs>
                :
                <div className="control-panel-body">
                    {markerType !== "detail" &&
                        <Collapsible className="w-full p-2">
                            <div className="flex items-center justify-between w-full">
                                <h2 className="text-lg font-semibold">Search Results</h2>

                                <CollapsibleTrigger>
                                    <TuneIcon />
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="collapsible-content">
                                <div className="flex justify-between">
                                    <label htmlFor="limit">Items per Request:</label>
                                    <select
                                        name="limit"
                                        id="limit"
                                        defaultValue={10}
                                        onChange={(e) => setLimit(Number(e.target.value))}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                    </select>
                                </div>
                                
                                <div className="flex justify-between">
                                    <label htmlFor="searchingRadius">Search Radius:</label>
                                    <select
                                        name="searchingRadius"
                                        id="searchingRadius"
                                        defaultValue={10000}
                                        onChange={(e) => setSearchingRadius(Number(e.target.value))}
                                    >
                                        <option value={10000}>10km</option>
                                        <option value={20000}>20km</option>
                                        <option value={30000}>30km</option>
                                    </select>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    }

                    {markers.length > 0 &&
                        <DisplayItems
                        markers={markers}
                        setMarkers={setMarkers}
                        items={items}
                        setItems={setItems}
                        setFlyToLocation={setFlyToLocation}
                        markerType={markerType}
                        setMarkerType={setMarkerType}
                        selectedMarker={selectedMarker}
                        setSelectedMarker={setSelectedMarker}
                    />
                    }
                    
                </div>
            }

        </>
    )
}