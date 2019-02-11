import buttonPrisonChart from './common/buttonChart';

(async(enabled) => {
  if (!enabled) return;

  await buttonPrisonChart.init();
  buttonPrisonChart.addUIElements();
})(true);