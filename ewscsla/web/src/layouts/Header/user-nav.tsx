import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useEffect, useState} from "react";
import {UserProfile} from "@/types/types";
import axios from "axios";
import {
    API_GET_LOGOUT_USER_URL,
    API_GET_USER_PROFILE_URL,
} from "@/app/config";
import {toast} from "@/components/ui/use-toast";

export function UserNav() {

    const [userProfile, setUserProfile] = useState<UserProfile>(null)
    useEffect(() => {
        axios.get(API_GET_USER_PROFILE_URL)
            .then((response) => {
                setUserProfile(response.data || [])
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Failed to load user profile. Try again.",
                })
            });
    }, [])


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{userProfile?.initials || "U"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.username || "@no-username"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userProfile?.email || "@no-email"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                    axios.get(API_GET_LOGOUT_USER_URL)
                        .then(response => {
                            window.location.reload()
                        })
                        .catch(error => {
                            toast({
                                variant: "destructive",
                                title: "Uh oh! Something went wrong.",
                                description: "Failed to logout. Try again.",
                            })
                        });
                }}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
