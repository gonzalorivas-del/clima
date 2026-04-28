import { EvaluationProvider, useEvaluation } from './context/EvaluationContext';
import tokens from './tokens/tokens.json';
import EvaluationList from './components/EvaluationList';
import EvaluationTypeModal from './components/modals/EvaluationTypeModal';
import WizardLayout from './components/wizard/WizardLayout';
import ToastContainer from './components/ui/Toast';
import ComponentsShowroom from './components/ComponentsShowroom';
import GeneralStep from './pages/GeneralStep';
import NotificacionesStep from './pages/NotificacionesStep';
import ResumenStep from './pages/ResumenStep';

function AppContent() {
  const { view, setView } = useEvaluation();
  const isFullPage = view === 'showroom' || view === 'general' || view === 'notificaciones' || view === 'resumen';

  return (
    <div>
      {view === 'list'           && <EvaluationList />}
      {view === 'wizard'         && <WizardLayout />}
      {view === 'general'        && <GeneralStep />}
      {view === 'notificaciones' && <NotificacionesStep />}
      {view === 'resumen'        && <ResumenStep />}
      {view === 'showroom'       && <ComponentsShowroom />}
      {!isFullPage && (
        <>
          <EvaluationTypeModal />
          <ToastContainer />
          <button
            onClick={() => setView('showroom')}
            style={{
              position: 'fixed',
              bottom: '14px',
              left: '16px',
              fontSize: '12px',
              color: tokens.colors.dash.$value,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              zIndex: 9999,
              fontFamily: 'Roboto, sans-serif',
              lineHeight: 1,
            }}
          >
            Ver componentes
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <EvaluationProvider>
      <AppContent />
    </EvaluationProvider>
  );
}
