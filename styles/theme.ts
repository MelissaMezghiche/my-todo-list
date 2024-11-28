import { createTheme } from '@mui/material/styles';

// Création d'un thème personnalisé pour le calendrier
const theme = createTheme({
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--sidebar-bg-color);',  // Fond du calendrier
          borderRadius: '20px', // Bordures arrondies
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Ombre portée
          padding: '0px', // Espacement interne
          width: '100%',
          height: '40vh',
          marginTop: '2vh'
        },
        header: {
          backgroundColor: '#1976d2', // Couleur de fond de l'en-tête
          color: '#ffffff', // Couleur du texte de l'en-tête
          fontSize: '1.2rem', // Taille de la police de l'en-tête
          fontWeight: 'bold', // Poids de la police de l'en-tête
        },
        toolbar: {
          backgroundColor: '#1976d2', // Couleur de la barre d'outils
          color: '#fff', // Couleur des éléments dans la barre d'outils
        },
        day: {
          backgroundColor: '#e3f2fd',  // Couleur de fond des jours
          color: '#1976d2', // Couleur du texte des jours
          borderRadius: '50%', // Jours arrondis
          '&.Mui-selected': {
            backgroundColor: '#fff', // Jour sélectionné
            color: '#ffffff', // Couleur du texte du jour sélectionné
          },
          '&.MuiDay--today': {
            backgroundColor: '#4caf50', // Jour actuel avec fond vert
            color: '#ffffff', // Texte du jour actuel en blanc
          },
        },
        dayOfMonth: {
          fontSize: '1rem', // Taille de la police des jours du mois
        },
        daySelected: {
          backgroundColor: '#fff !important', // Forcer la couleur de fond du jour sélectionné
          color: '#ffffff !important', // Forcer la couleur du texte du jour sélectionné
        },
        grid: {
          display: 'grid', // Assurez-vous que les jours s'affichent en grille
          gap: '10px', // Espacement entre les jours
        },
        week: {
          display: 'flex', // Disposition des jours de la semaine en ligne
          justifyContent: 'space-between', // Espacement égal entre les jours de la semaine
        },
        button: {
          color: '#1976d2', // Couleur des boutons (précédent/suivant)
        },
      },
    },
  },
});

export default theme;
