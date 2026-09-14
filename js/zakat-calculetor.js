document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const silverPriceInput = document.getElementById('silverPrice');
  const nisabThresholdText = document.getElementById('nisabThresholdText');
  
  const cashInHand = document.getElementById('cashInHand');
  const goldValue = document.getElementById('goldValue');
  const businessStock = document.getElementById('businessStock');
  const receivableMoney = document.getElementById('receivableMoney');
  
  const debtsToPay = document.getElementById('debtsToPay');
  const unpaidBills = document.getElementById('unpaidBills');

  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');

  const resultCard = document.getElementById('resultCard');
  const resultStatus = document.getElementById('resultStatus');
  const totalAssetsText = document.getElementById('totalAssetsText');
  const totalDebtsText = document.getElementById('totalDebtsText');
  const netWorthText = document.getElementById('netWorthText');
  const finalZakatAmount = document.getElementById('finalZakatAmount');
  const zakatFinalBox = document.getElementById('zakatFinalBox');

  // রূপার নেসাব পরিমাণ = ৫২.৫ তোলা = প্রায় ৬১২.৩৬ গ্রাম
  const SILVER_NISAB_GRAMS = 612.36;

  // সংখ্যাকে বাংলা কারেন্সিতে রূপান্তর ফাংশন
  function formatBengaliCurrency(number) {
    return '৳ ' + Math.round(number).toLocaleString('bn-BD');
  }

  // ইনপুট থেকে নিরাপদ সংখ্যা নেওয়া
  function getNum(elem) {
    const val = parseFloat(elem.value);
    return isNaN(val) || val < 0 ? 0 : val;
  }

  // নেসাবের মোট মূল্য আপডেট করা
  function updateNisabThreshold() {
    const perGramPrice = getNum(silverPriceInput);
    const nisabTotal = perGramPrice * SILVER_NISAB_GRAMS;
    nisabThresholdText.innerText = formatBengaliCurrency(nisabTotal);
    return nisabTotal;
  }

  silverPriceInput.addEventListener('input', updateNisabThreshold);

  // জাকাত হিসাব ফাংশন
  function calculateZakat() {
    const nisabAmount = updateNisabThreshold();

    const totalAssets = getNum(cashInHand) + getNum(goldValue) + getNum(businessStock) + getNum(receivableMoney);
    const totalDebts = getNum(debtsToPay) + getNum(unpaidBills);
    const netZakatable = totalAssets - totalDebts;

    // বিবরণ প্রদর্শন
    totalAssetsText.innerText = formatBengaliCurrency(totalAssets);
    totalDebtsText.innerText = formatBengaliCurrency(totalDebts);
    netWorthText.innerText = formatBengaliCurrency(netZakatable > 0 ? netZakatable : 0);

    resultCard.style.display = 'block';

    if (netZakatable >= nisabAmount && nisabAmount > 0) {
      const zakatAmount = netZakatable * 0.025; // ২.৫% জাকাত
      resultStatus.className = 'result-status eligible';
      resultStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> মাশাআল্লাহ! আপনার ওপর জাকাত ফরজ হয়েছে।';
      
      zakatFinalBox.style.display = 'block';
      finalZakatAmount.innerText = formatBengaliCurrency(zakatAmount);
    } else {
      resultStatus.className = 'result-status not-eligible';
      resultStatus.innerHTML = '<i class="fa-solid fa-circle-info"></i> আপনার সম্পদ নেসাব পরিমাণের কম হওয়ায় জাকাত ফরজ নয়।';
      
      zakatFinalBox.style.display = 'none';
    }

    // ফলাফলের দিকে স্মুথ স্ক্রোল
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // রিসেট ফাংশন
  function resetAll() {
    const inputs = document.querySelectorAll('.calc-input');
    inputs.forEach(input => input.value = '');
    resultCard.style.display = 'none';
  }

  calculateBtn.addEventListener('click', calculateZakat);
  resetBtn.addEventListener('click', resetAll);

  // পেজ লোডের সময় নেসাব ইনিশিয়ালাইজ করা
  updateNisabThreshold();
});
    
