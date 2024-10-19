import Calendar from 'components/calendar';
import PageContainer from 'components/page-container';

function CalendarPage() {
  return (
    <PageContainer header={{ title: '万年历' }}>
      <Calendar />
    </PageContainer>
  );
}

export default CalendarPage;
