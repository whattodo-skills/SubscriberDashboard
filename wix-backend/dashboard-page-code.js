import { installDailyCheckInBridge } from './daily-check-in-bridge-page';

const DASHBOARD_HEIGHT_MIN = 1200;
const DASHBOARD_HEIGHT_MAX = 9000;
const DASHBOARD_HEIGHT_STEP = 100;

function heightClass(height) {
  const bounded = Math.max(DASHBOARD_HEIGHT_MIN, Math.min(DASHBOARD_HEIGHT_MAX, Number(height) || DASHBOARD_HEIGHT_MIN));
  return `dashboard-height-${Math.ceil(bounded / DASHBOARD_HEIGHT_STEP) * DASHBOARD_HEIGHT_STEP}`;
}

function installDashboardAutoHeight($w) {
  const dashboard = $w('#html6');
  const section = $w('#section57');
  let applied = '';

  dashboard.scrolling = 'no';
  dashboard.onMessage((event) => {
    const data = event.data || {};
    if (data.type !== 'dashboardContentHeight') return;
    const next = heightClass(data.height + 24);
    if (next === applied) return;
    if (applied) {
      dashboard.customClassList.remove(applied);
      section.customClassList.remove(applied);
    }
    dashboard.customClassList.add(next);
    section.customClassList.add(next);
    applied = next;
  });
}

$w.onReady(() => {
  installDailyCheckInBridge($w);
  installDashboardAutoHeight($w);
});
