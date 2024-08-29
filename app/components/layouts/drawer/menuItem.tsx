import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
} from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface MenuItemProps {
  title: string
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>
  url: string
}
export default function MenuItem({ Icon, title, url }: MenuItemProps) {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton href={`${url}`}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={title} />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
