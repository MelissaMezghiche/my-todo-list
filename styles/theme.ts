import { createTheme } from '@mui/material/styles';

// Création d'un thème personnalisé pour le calendrier
const theme = createTheme({
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--sidebar-bg-color);',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          width: '100%',
          height: '40vh',
          marginTop: '2vh',
          color:'var(--black-in-lightmode-white-in-darkmode)'
        }
       
      },
    },
  },
});

export default theme;
