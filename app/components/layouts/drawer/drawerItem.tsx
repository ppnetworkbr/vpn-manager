import MenuItem from './menuItem'
import CollapsedMenu from './collapsedMenu'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export interface DrawerItemProps {
  title: string
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>
  url?: string
  itens?: {
    Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>
    title: string
    url: string
  }[]
}
export default function DrawerItem({
  title,
  Icon,
  url,
  itens,
}: DrawerItemProps) {
  if (itens) {
    return (
      <CollapsedMenu MenuIcon={Icon} title={title} open={false} itens={itens} />
    )
  }

  return <MenuItem title={title} url={!url ? '' : url} Icon={Icon} />
}
