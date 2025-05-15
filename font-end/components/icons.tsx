import { LucideProps } from "lucide-react"
import { BookOpen, Menu, Settings } from "lucide-react"

export const Icons = {
  logo: (props: LucideProps) => <BookOpen {...props} />,
  menu: (props: LucideProps) => <Menu {...props} />,
  settings: (props: LucideProps) => <Settings {...props} />,
}