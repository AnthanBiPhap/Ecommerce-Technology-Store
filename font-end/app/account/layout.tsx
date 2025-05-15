import AccountMenu from "../ui/AccountMenu"


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="bg-gray-100 flex justify-center pt-5 pb-5">
        <div className="flex gap-x-3 w-[1200px]">
          <AccountMenu />
          {children}
        </div> 
      </div>     
    )
  }