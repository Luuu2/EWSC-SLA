import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {DepartmentData} from "@/types/types";

export type DepartmentsProps = {
    department_data: DepartmentData[];
}

export function Departments({department_data}: DepartmentsProps) {
    return (
        <div className="space-y-8">
            {
                department_data.length >= 1
                    ? department_data.map((department, index) => (
                        <div className="flex items-center" key={index}>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{department.name.charAt(0).toUpperCase() || "D"}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{department.name}</p>
                                <div className="flex gap-x-4">
                                    <p className="text-sm text-muted-foreground">
                                        Employees: {department.employees_count}
                                    </p>
                                    <p className="text-sm text-muted-foreground">-</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sla Entries: {department.sla_entries_count}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                    : <div></div>
            }
        </div>
    )
}
