'use client'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  SvgIconTypeMap,
} from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React from 'react'
interface itensProps {
  title: string
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>
  url: string
}
export interface listNestedProps {
  open: boolean
  title: string
  MenuIcon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>
  itens: itensProps[]
}

export default function CollapsedMenu({
  open = false,
  title,
  itens,
  MenuIcon,
}: listNestedProps) {
  const [openList, setOpenList] = React.useState(open)
  function handleClick() {
    setOpenList(!openList)
  }

  return (
    <>
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
          <ListItemText primary={title} />
          {openList ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </List>
      <Collapse in={openList} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {itens.map((item) => (
            <ListItemButton
              key={item.title}
              sx={{ pl: 4 }}
              href={`${item.url}`}
            >
              <ListItemIcon>{<item.Icon />}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  )
}
