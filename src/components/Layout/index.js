import React, { useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import ApartmentIcon from '@material-ui/icons/Apartment'
import AssignmentIcon from '@material-ui/icons/Assignment'
import ArchiveIcon from '@material-ui/icons/Archive'
import MapIcon from '@material-ui/icons/Map'
import FlagIcon from '@material-ui/icons/Flag'
import LogOutIcon from '@material-ui/icons/ExitToApp'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import { UserContext } from 'contexts'
import { Button, ListSubheader } from '@material-ui/core'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  logOutButton: {
    marginLeft: 'auto',
  },
  mobileVersionDisplay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: '0.6rem',
  },
}))

function ResponsiveDrawer({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { user } = useContext(UserContext)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const logOut = () => {
    localStorage.clear()
    window.location.reload()
  }

  const NavOption = ({ to, Icon, text, onClick }) => (
    <NavLink
      exact
      to={to || ''}
      style={{
        textDecoration: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
      }}
      activeStyle={{
        color: 'blue',
      }}
      onClick={() => {
        setMobileOpen(false)
        onClick && onClick()
      }}
    >
      <ListItem button key={text}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </NavLink>
  )

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      {user && user.is_admin === 1 ? (
        <List>
          <NavOption to={'/users'} text={'Usuarios'} Icon={PersonIcon} />
          {user && user.is_superadmin === 1 && (
            <NavOption to={'/admins'} text={'Administradores'} Icon={SupervisorAccountIcon} />
          )}
          <NavOption to={'/buildings'} text={'Edificios'} Icon={ApartmentIcon} />
          <NavOption to={'/assignments'} text={'Asignaciones'} Icon={AssignmentIcon} />
          <NavOption to={'/statistics'} text={'Estadisticas'} Icon={MapIcon} />
          <NavOption to={'/campaigns'} text={'Campañas'} Icon={FlagIcon} />
          <Hidden smUp>
            <Divider />
            <NavOption text={'Cerrar sesión'} onClick={logOut} Icon={LogOutIcon} />
          </Hidden>
        </List>
      ) : (
        <>
          <List subheader={<ListSubheader>Asignaciones</ListSubheader>}>
            <NavOption to={'/my-active-assignments'} text={'Activas'} Icon={AssignmentIcon} />
            <NavOption to={'/my-active-assignments'} text={'Anteriores'} Icon={ArchiveIcon} />
          </List>
          <Divider />
          <List>
            <NavOption text={'Cerrar sesión'} onClick={logOut} Icon={LogOutIcon} />
          </List>
        </>
      )}
    </div>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Gestor de edificios{' '}
            {user && user.is_admin === 1 ? `- ${process.env.REACT_APP_VERSION}` : ''}
          </Typography>
          <Hidden xsDown>
            <Button className={classes.logOutButton} color="inherit" onClick={logOut}>
              Cerrar sesión
            </Button>
          </Hidden>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="navegación">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}

            <span className={classes.mobileVersionDisplay}>
              Versión {process.env.REACT_APP_VERSION}
            </span>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}

export default ResponsiveDrawer
