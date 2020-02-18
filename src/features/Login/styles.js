import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  container: {
    background: 'rgb(245, 246, 248)',
    height: '100vh',
  },
  cardContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
  },
  pos: {
    fontSize: 14,
    marginBottom: 12,
  },
})

export { useStyles }
