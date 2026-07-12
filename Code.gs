/**
 * Household Income & Expense Web App
 * Sheets used:
 *   1) Transactions
 *   2) Daily Report
 *
 * Transaction columns:
 * A Date | B Time | C Type | D Category / Income Type | E Subcategory
 * F Payment | G Currency | H Amount | I Note
 *
 * Deploy as Web App:
 * Execute as: Me
 * Who has access: Anyone
 */

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────
const SHEET_ID = '14zQUmADHeJom-nSJikcUoEnEw77Mo6mtSSUmtpjDOkg';
const SHEET_TXN = 'Transactions';
const SHEET_DAILY = 'Daily Report';
const TIMEZONE = 'Asia/Phnom_Penh';
const EXCHANGE_RATE = 4100; // Edit when your reporting rate changes.

const TX_HEADERS = [
  'Time',
  'Date',
  'Type',
  'Category / Income Type',
  'Subcategory',
  'Payment Method',
  'Currency',
  'Amount',
  'Note'
];

const TYPE_LABELS = {
  income: 'ចំណូល',
  expense: 'ចំណាយ'
};

const INCOME_LABELS = {
  salary: 'ប្រាក់ខែ',
  weekly: 'ចំណូលប្រចាំសប្តាហ៍',
  additional: 'ចំណូលបន្ថែម'
};

const CATEGORY_LABELS = {
  household: 'ចំណាយក្នុងផ្ទះ',
  children: 'ចំណាយសម្រាប់កូន',
  personal: 'ចំណាយផ្ទាល់ខ្លួន',
  business: 'ចំណាយអាជីវកម្ម',
  debt: 'បំណុល',
  irregular: 'ចំណាយមិនទៀងទាត់',
  travel: 'ការធ្វើដំណើរ និងយានយន្ត'
};

const SUBCATEGORY_LABELS = {
  household: {
    water_electric: 'ទឹក និងភ្លើង',
    rice: 'អង្ករ',
    fruit: 'ផ្លែឈើ',
    eggs: 'ស៊ុត',
    spices: 'គ្រឿងទេស',
    fish_sauce: 'ទឹកត្រី',
    soy_sauce: 'ទឹកស៊ីអ៊ីវ',
    cooking_oil: 'ប្រេងឆា',
    beverages: 'ភេសជ្ជៈ',
    vegetables: 'បន្លែ',
    seafood: 'គ្រឿងសមុទ្រ',
    fish: 'ត្រី',
    beef: 'សាច់គោ',
    chicken: 'សាច់មាន់',
    pork: 'សាច់ជ្រូក',
    kitchen_tools: 'សម្ភារៈផ្ទះបាយ',
    cleaning: 'សម្ភារៈសម្អាតផ្ទះ',
    gas_cooking: 'ហ្គាស និងឧបករណ៍ចម្អិន',
    laundry: 'សម្ភារៈបោកគក់',
    appliance_repair: 'ថែទាំឧបករណ៍ផ្ទះ',
    home_repair: 'ជួសជុលផ្ទះសម្បែង',
    toiletries: 'សម្ភារៈប្រើប្រាស់ទូទៅ',
    internet_phone: 'ថ្លៃអ៊ីនធឺណិត និងទូរស័ព្ទ',
    community_service: 'សេវាសង្គមក្នុងផ្ទះ',
    decor: 'របស់របរតុបតែងផ្ទះ'
  },
  children: {
    nutrition: 'អាហារូបត្ថម្ភ',
    hygiene: 'ការថែរក្សាអនាម័យ',
    clothing: 'សម្លៀកបំពាក់',
    education: 'ការសិក្សា',
    entertainment: 'ការកម្សាន្ត',
    health: 'សុខភាព',
    transport: 'ការដឹកជញ្ជូន',
    supplies: 'សម្ភារៈប្រើប្រាស់'
  },
  personal: {
    skincare: 'ផលិតផលថែរក្សាស្បែក',
    hygiene: 'ផលិតផលអនាម័យ',
    beauty: 'ការថែរក្សាសម្រស់',
    clothing: 'សម្លៀកបំពាក់ និងគ្រឿងអលង្ការ',
    health: 'សុខភាពផ្ទាល់ខ្លួន',
    development: 'ការអភិវឌ្ឍន៍ខ្លួនឯង',
    entertainment: 'ការកម្សាន្ត និងសង្គម',
    transport: 'ការដឹកជញ្ជូនផ្ទាល់ខ្លួន',
    accessories: 'គ្រឿងប្រើប្រាស់ផ្ទាល់ខ្លួន'
  },
  business: {
    inventory: 'ស្តុកទំនិញ',
    packaging: 'ការវេចខ្ចប់',
    marketing: 'ការផ្សាយពាណិជ្ជកម្ម',
    delivery: 'ការដឹកជញ្ជូន',
    equipment: 'ឧបករណ៍ធ្វើម្ហូប',
    losses: 'ការខាតបង់'
  },
  debt: {
    family_debt: 'បំណុលសាច់ញាតិ',
    personal_debt: 'បំណុលផ្ទាល់ខ្លួន',
    business_debt: 'បំណុលអាជីវកម្ម'
  },
  irregular: {
    ceremony: 'ពិធីបុណ្យ និងសាសនា',
    family_support: 'ការឧបត្ថម្ភគ្រួសារ',
    medical: 'ថ្លៃព្យាបាលជំងឺបន្ទាន់',
    vacation: 'ការធ្វើដំណើរកម្សាន្ត'
  },
  travel: {
    fuel: 'ប្រេងសាំង',
    maintenance: 'ការថែទាំយានយន្ត',
    car_wash: 'ការលាងសម្អាតយានយន្ត',
    spare_parts: 'គ្រឿងបន្លាស់ និងជួសជុល',
    tax_insurance: 'ពន្ធ និងធានារ៉ាប់រង',
    ride_hailing: 'សេវាដឹកជញ្ជូនសាធារណៈ',
    parking_delivery: 'ថ្លៃចំណត និងផ្ញើយានយន្ត',
    traffic_fine: 'ថ្លៃផាកពិន័យចរាចរណ៍'
  }
};

const PAYMENT_LABELS = {
  cash: 'សាច់ប្រាក់',
  aba: 'ធនាគារ ABA',
  acleda: 'ធនាគារ ACLEDA'
};

// ─────────────────────────────────────────────────────────────
// WEB APP ENDPOINTS
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  const response = { success: false };
  const lock = LockService.getScriptLock();

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('POST body is empty.');
    }

    const data = JSON.parse(e.postData.contents);
    const tx = validatePayload_(data);

    // Optional duplicate protection. Send requestId from the browser.
    if (data.requestId) {
      const cache = CacheService.getScriptCache();
      const cacheKey = 'request_' + String(data.requestId);
      if (cache.get(cacheKey)) {
        return jsonResponse_({
          success: true,
          duplicate: true,
          message: 'This transaction was already received.'
        });
      }
      cache.put(cacheKey, '1', 600);
    }

    lock.waitLock(30000);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = getOrCreateTransactionSheet_(ss);
    const now = new Date();
    const localDate = new Date(
      Number(Utilities.formatDate(now, TIMEZONE, 'yyyy')),
      Number(Utilities.formatDate(now, TIMEZONE, 'MM')) - 1,
      Number(Utilities.formatDate(now, TIMEZONE, 'dd'))
    );
    const localTime = Utilities.formatDate(now, TIMEZONE, 'HH:mm:ss');

    sheet.appendRow([
      '',                 // A: Time
      localDate,          // B: Date object
      tx.type,            // C: income / expense
      tx.category,        // D: income type or expense category key
      tx.subCategory,     // E: blank for income
      tx.payment,         // F: cash / aba / acleda
      tx.currency,        // G: USD / KHR
      tx.amount,          // H: number
      tx.note             // I: optional note
    ]);

    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1).setNumberFormat('dd-mmm-yyyy');
    sheet.getRange(newRow, 8).setNumberFormat('#,##0.00');

    SpreadsheetApp.flush();

    response.success = true;
    response.row = newRow;
    response.message = 'Transaction saved successfully.';
    response.transaction = tx;
    response.summary = summary;
  } catch (err) {
    response.error = err && err.message ? err.message : String(err);
    console.error(err);
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }

  return jsonResponse_(response);
}

function doGet(e) {
  try {
    const targetDate = e && e.parameter && e.parameter.date
      ? parseDate_(e.parameter.date)
      : new Date();

    const summary = calculateDailySummary_(targetDate);
    return jsonResponse_({ success: true, summary: summary });
  } catch (err) {
    return jsonResponse_({
      success: false,
      error: err && err.message ? err.message : String(err)
    });
  }
}

// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────
function validatePayload_(data) {
  const type = normalizeType_(data.type);
  const category = normalizeKey_(
    data.category || data.incomeType || data.expenseCategory
  );
  const subCategory = type === 'income'
    ? ''
    : normalizeKey_(data.subCategory || data.subcategory);
  const payment = normalizeKey_(data.payment || data.paymentMethod);
  const currency = normalizeCurrency_(data.currency);
  const amount = Number(data.amount);
  const note = String(data.note || '').trim();

  if (!type) {
    throw new Error('Invalid type. Use "income" or "expense".');
  }

  if (!category) {
    throw new Error('Category or income type is required.');
  }

  if (type === 'income' && !INCOME_LABELS[category]) {
    throw new Error('Invalid income type: ' + category);
  }

  if (type === 'expense' && !CATEGORY_LABELS[category]) {
    throw new Error('Invalid expense category: ' + category);
  }

  if (type === 'expense') {
    if (!subCategory) {
      throw new Error('Subcategory is required for an expense.');
    }

    if (
      !SUBCATEGORY_LABELS[category] ||
      !SUBCATEGORY_LABELS[category][subCategory]
    ) {
      throw new Error(
        'Invalid subcategory "' + subCategory + '" for category "' + category + '".'
      );
    }
  }

  if (!PAYMENT_LABELS[payment]) {
    throw new Error('Invalid payment method: ' + payment);
  }

  if (currency !== 'USD' && currency !== 'KHR') {
    throw new Error('Invalid currency. Use USD or KHR.');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be a number greater than zero.');
  }

  return {
    type: type,
    category: category,
    subCategory: subCategory,
    payment: payment,
    currency: currency,
    amount: amount,
    note: note
  };
}

// ─────────────────────────────────────────────────────────────
// TRANSACTIONS SHEET
// ─────────────────────────────────────────────────────────────
function getOrCreateTransactionSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_TXN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TXN);
  }

  const firstRow = sheet.getRange(1, 1, 1, TX_HEADERS.length).getValues()[0];
  const hasHeader = firstRow.some(function (value) {
    return String(value || '').trim() !== '';
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, TX_HEADERS.length).setValues([TX_HEADERS]);
    sheet.getRange(1, 1, 1, TX_HEADERS.length)
      .setBackground('#16324F')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }

  sheet.setColumnWidth(1, 16);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 90);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 260);

  return sheet;
}

function readTransactionsForDate_(targetDate) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateTransactionSheet_(ss);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return [];
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  const targetKey = dateKey_(targetDate);

  return rows
    .map(function (row) {
      const rowDate = parseDate_(row[1]);
      if (!rowDate || dateKey_(rowDate) !== targetKey) {
        return null;
      }

      const type = normalizeType_(row[2]);
      if (!type) {
        return null;
      }

      return {
        date: rowDate,
        time: String(row[0] || ''),
        type: type,
        category: normalizeKey_(row[3]),
        subCategory: normalizeKey_(row[4]),
        payment: normalizeKey_(row[5]),
        currency: normalizeCurrency_(row[6]),
        amount: Number(row[7]) || 0,
        note: String(row[8] || '')
      };
    })
    .filter(function (row) {
      return row !== null;
    });
}

// ─────────────────────────────────────────────────────────────
// DAILY CALCULATION
// ─────────────────────────────────────────────────────────────
function calculateDailySummary_(targetDate) {
  const date = parseDate_(targetDate) || new Date();
  const transactions = readTransactionsForDate_(date);

  const summary = {
    date: dateKey_(date),
    exchangeRate: EXCHANGE_RATE,
    transactionCount: transactions.length,
    incomeUSD: 0,
    expenseUSD: 0,
    balanceUSD: 0,
    incomeByCurrency: { USD: 0, KHR: 0 },
    expenseByCurrency: { USD: 0, KHR: 0 },
    incomeByType: {},
    incomeCountByType: {},
    expenseByCategory: {},
    expenseCountByCategory: {},
    expenseByPayment: {},
    expenseCountByPayment: {},
    transactions: transactions
  };

  transactions.forEach(function (tx) {
    const usdValue = toUSD_(tx.amount, tx.currency);

    if (tx.type === 'income') {
      summary.incomeUSD += usdValue;
      summary.incomeByCurrency[tx.currency] =
        (summary.incomeByCurrency[tx.currency] || 0) + tx.amount;
      summary.incomeByType[tx.category] =
        (summary.incomeByType[tx.category] || 0) + usdValue;
      summary.incomeCountByType[tx.category] =
        (summary.incomeCountByType[tx.category] || 0) + 1;
    } else {
      summary.expenseUSD += usdValue;
      summary.expenseByCurrency[tx.currency] =
        (summary.expenseByCurrency[tx.currency] || 0) + tx.amount;
      summary.expenseByCategory[tx.category] =
        (summary.expenseByCategory[tx.category] || 0) + usdValue;
      summary.expenseCountByCategory[tx.category] =
        (summary.expenseCountByCategory[tx.category] || 0) + 1;
      summary.expenseByPayment[tx.payment] =
        (summary.expenseByPayment[tx.payment] || 0) + usdValue;
      summary.expenseCountByPayment[tx.payment] =
        (summary.expenseCountByPayment[tx.payment] || 0) + 1;
    }
  });

  summary.incomeUSD = round2_(summary.incomeUSD);
  summary.expenseUSD = round2_(summary.expenseUSD);
  summary.balanceUSD = round2_(summary.incomeUSD - summary.expenseUSD);

  return summary;
}

// ─────────────────────────────────────────────────────────────
// DAILY REPORT SHEET
// ─────────────────────────────────────────────────────────────
function updateDailyReport(targetDate) {
  const date = parseDate_(targetDate) || new Date();
  const summary = calculateDailySummary_(date);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_DAILY);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_DAILY);
  }

  // The sheet is dedicated to the generated report.
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.clear();
  sheet.setHiddenGridlines(true);
  sheet.setFrozenRows(3);

  const COLORS = {
    navy: '#16324F',
    teal: '#0F8B8D',
    green: '#2E7D32',
    greenLight: '#EAF5EA',
    red: '#C62828',
    redLight: '#FDECEC',
    blueLight: '#EAF3F8',
    amberLight: '#FFF4E5',
    grayLight: '#F4F6F8',
    border: '#D9E1E8',
    white: '#FFFFFF',
    dark: '#1F2933'
  };

  // Header
  sheet.getRange('A1:I1').merge().setValue('របាយការណ៍ចំណូល និងចំណាយប្រចាំថ្ងៃ')
    .setBackground(COLORS.navy)
    .setFontColor(COLORS.white)
    .setFontWeight('bold')
    .setFontSize(18)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 46);

  sheet.getRange('A2:I2').merge()
    .setValue('កាលបរិច្ឆេទ: ' + Utilities.formatDate(date, TIMEZONE, 'dd-MMM-yyyy'))
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center');

  sheet.getRange('A3:I3').merge()
    .setValue('អត្រាប្តូរប្រាក់: 1 USD = ' + EXCHANGE_RATE.toLocaleString('en-US') + ' KHR')
    .setFontColor('#666666')
    .setHorizontalAlignment('center');

  // KPI cards
  setKpiCard_(sheet, 'A5:B6', 'ចំណូលសរុប (USD)', summary.incomeUSD, COLORS.greenLight, COLORS.green);
  setKpiCard_(sheet, 'C5:D6', 'ចំណាយសរុប (USD)', summary.expenseUSD, COLORS.redLight, COLORS.red);
  setKpiCard_(sheet, 'E5:F6', 'សមតុល្យ (USD)', summary.balanceUSD, COLORS.blueLight, summary.balanceUSD >= 0 ? COLORS.green : COLORS.red);
  setKpiCard_(sheet, 'G5:I6', 'ប្រតិបត្តិការ', summary.transactionCount, COLORS.amberLight, COLORS.dark, '#,##0');

  // Income by type
  setSectionTitle_(sheet, 'A9:D9', 'ចំណូលតាមប្រភេទ', COLORS.teal, COLORS.white);
  sheet.getRange('A10:D10').setValues([['Key', 'ប្រភេទចំណូល', 'ប្រតិបត្តិការ', 'សមមូល USD']]);
  formatTableHeader_(sheet.getRange('A10:D10'), COLORS.navy, COLORS.white);

  const incomeRows = Object.keys(INCOME_LABELS).map(function (key) {
    return [
      key,
      INCOME_LABELS[key],
      summary.incomeCountByType[key] || 0,
      round2_(summary.incomeByType[key] || 0)
    ];
  });
  sheet.getRange(11, 1, incomeRows.length, 4).setValues(incomeRows);
  formatDataTable_(sheet.getRange(11, 1, incomeRows.length, 4), COLORS.border);
  sheet.getRange(11, 4, incomeRows.length, 1).setNumberFormat('$#,##0.00');

  // Expense by category
  setSectionTitle_(sheet, 'F9:I9', 'ចំណាយតាមប្រភេទ', COLORS.teal, COLORS.white);
  sheet.getRange('F10:I10').setValues([['Key', 'ប្រភេទចំណាយ', 'ប្រតិបត្តិការ', 'សមមូល USD']]);
  formatTableHeader_(sheet.getRange('F10:I10'), COLORS.navy, COLORS.white);

  const expenseRows = Object.keys(CATEGORY_LABELS)
    .map(function (key) {
      return [
        key,
        CATEGORY_LABELS[key],
        summary.expenseCountByCategory[key] || 0,
        round2_(summary.expenseByCategory[key] || 0)
      ];
    })
    .sort(function (a, b) {
      return b[3] - a[3];
    });

  sheet.getRange(11, 6, expenseRows.length, 4).setValues(expenseRows);
  formatDataTable_(sheet.getRange(11, 6, expenseRows.length, 4), COLORS.border);
  sheet.getRange(11, 9, expenseRows.length, 1).setNumberFormat('$#,##0.00');

  // Payment summary
  setSectionTitle_(sheet, 'A20:D20', 'ចំណាយតាមវិធីបង់ប្រាក់', COLORS.teal, COLORS.white);
  sheet.getRange('A21:D21').setValues([['Key', 'វិធីបង់ប្រាក់', 'ប្រតិបត្តិការ', 'សមមូល USD']]);
  formatTableHeader_(sheet.getRange('A21:D21'), COLORS.navy, COLORS.white);

  const paymentRows = Object.keys(PAYMENT_LABELS).map(function (key) {
    return [
      key,
      PAYMENT_LABELS[key],
      summary.expenseCountByPayment[key] || 0,
      round2_(summary.expenseByPayment[key] || 0)
    ];
  });
  sheet.getRange(22, 1, paymentRows.length, 4).setValues(paymentRows);
  formatDataTable_(sheet.getRange(22, 1, paymentRows.length, 4), COLORS.border);
  sheet.getRange(22, 4, paymentRows.length, 1).setNumberFormat('$#,##0.00');

  // Currency summary
  setSectionTitle_(sheet, 'F20:I20', 'សរុបតាមរូបិយប័ណ្ណ', COLORS.teal, COLORS.white);
  sheet.getRange('F21:I21').setValues([['ប្រភេទ', 'USD', 'KHR', 'សមមូល USD']]);
  formatTableHeader_(sheet.getRange('F21:I21'), COLORS.navy, COLORS.white);

  const currencyRows = [
    [
      'ចំណូល',
      summary.incomeByCurrency.USD || 0,
      summary.incomeByCurrency.KHR || 0,
      summary.incomeUSD
    ],
    [
      'ចំណាយ',
      summary.expenseByCurrency.USD || 0,
      summary.expenseByCurrency.KHR || 0,
      summary.expenseUSD
    ]
  ];
  sheet.getRange('F22:I23').setValues(currencyRows);
  formatDataTable_(sheet.getRange('F22:I23'), COLORS.border);
  sheet.getRange('G22:G23').setNumberFormat('$#,##0.00');
  sheet.getRange('H22:H23').setNumberFormat('#,##0 "៛"');
  sheet.getRange('I22:I23').setNumberFormat('$#,##0.00');

  // Transactions
  const tableStart = 27;
  setSectionTitle_(sheet, 'A' + tableStart + ':I' + tableStart, 'ប្រតិបត្តិការប្រចាំថ្ងៃ', COLORS.teal, COLORS.white);

  const headerRow = tableStart + 1;
  sheet.getRange(headerRow, 1, 1, 9).setValues([[
    'ម៉ោង',
    'ប្រភេទ',
    'ប្រភេទចំណូល/ចំណាយ',
    'ប្រភេទរង',
    'បង់ប្រាក់',
    'រូបិយប័ណ្ណ',
    'ចំនួន',
    'សមមូល USD',
    'កំណត់ចំណាំ'
  ]]);
  formatTableHeader_(sheet.getRange(headerRow, 1, 1, 9), COLORS.navy, COLORS.white);

  if (summary.transactions.length === 0) {
    sheet.getRange(headerRow + 1, 1, 1, 9).merge()
      .setValue('មិនមានប្រតិបត្តិការសម្រាប់កាលបរិច្ឆេទនេះទេ')
      .setHorizontalAlignment('center')
      .setFontColor('#777777')
      .setBackground(COLORS.grayLight);
  } else {
    const transactionRows = summary.transactions
      .slice()
      .reverse()
      .map(function (tx) {
        return [
          tx.time,
          TYPE_LABELS[tx.type] || tx.type,
          tx.type === 'income'
            ? (INCOME_LABELS[tx.category] || tx.category)
            : (CATEGORY_LABELS[tx.category] || tx.category),
          tx.type === 'expense'
            ? getSubcategoryLabel_(tx.category, tx.subCategory)
            : '',
          PAYMENT_LABELS[tx.payment] || tx.payment,
          tx.currency,
          tx.amount,
          round2_(toUSD_(tx.amount, tx.currency)),
          tx.note
        ];
      });

    sheet.getRange(headerRow + 1, 1, transactionRows.length, 9).setValues(transactionRows);
    formatDataTable_(sheet.getRange(headerRow + 1, 1, transactionRows.length, 9), COLORS.border);
    sheet.getRange(headerRow + 1, 7, transactionRows.length, 1).setNumberFormat('#,##0.00');
    sheet.getRange(headerRow + 1, 8, transactionRows.length, 1).setNumberFormat('$#,##0.00');
  }

  // Widths
  const widths = [80, 90, 190, 190, 130, 90, 110, 120, 250];
  widths.forEach(function (width, index) {
    sheet.setColumnWidth(index + 1, width);
  });

  sheet.getDataRange().setVerticalAlignment('middle');
  return summary;
}

function refreshDailyReport() {
  return updateDailyReport(new Date());
}

function refreshSelectedDate() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_DAILY);
  const value = sheet ? sheet.getRange('B2').getValue() : new Date();
  return updateDailyReport(parseDate_(value) || new Date());
}

// ─────────────────────────────────────────────────────────────
// REPORT FORMATTING HELPERS
// ─────────────────────────────────────────────────────────────
function setKpiCard_(sheet, rangeA1, title, value, background, fontColor, numberFormat) {
  const range = sheet.getRange(rangeA1);
  range.merge();
  const cell = range.getCell(1, 1);
  cell.setValue(title + '\n' + value)
    .setBackground(background)
    .setFontColor(fontColor)
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  if (numberFormat && typeof value === 'number') {
    cell.setNumberFormat(numberFormat);
  }

  range.setBorder(
    true, true, true, true, false, false,
    '#D9E1E8',
    SpreadsheetApp.BorderStyle.SOLID
  );
}

function setSectionTitle_(sheet, rangeA1, text, background, fontColor) {
  const range = sheet.getRange(rangeA1);
  range.merge();
  range.getCell(1, 1)
    .setValue(text)
    .setBackground(background)
    .setFontColor(fontColor)
    .setFontWeight('bold')
    .setFontSize(11)
    .setVerticalAlignment('middle');
}

function formatTableHeader_(range, background, fontColor) {
  range
    .setBackground(background)
    .setFontColor(fontColor)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(
      true, true, true, true, true, true,
      '#D9E1E8',
      SpreadsheetApp.BorderStyle.SOLID
    );
}

function formatDataTable_(range, borderColor) {
  range
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(
      true, true, true, true, true, true,
      borderColor,
      SpreadsheetApp.BorderStyle.SOLID
    );
}

// ─────────────────────────────────────────────────────────────
// GENERAL HELPERS
// ─────────────────────────────────────────────────────────────
function normalizeKey_(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeType_(value) {
  const key = normalizeKey_(value);
  if (key === 'income' || key === 'ចំណូល') return 'income';
  if (key === 'expense' || key === 'ចំណាយ') return 'expense';
  return '';
}

function normalizeCurrency_(value) {
  return String(value || 'USD').trim().toUpperCase();
}

function parseDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function dateKey_(value) {
  const date = parseDate_(value);
  if (!date) return '';
  return Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd');
}

function toUSD_(amount, currency) {
  const number = Number(amount) || 0;
  return normalizeCurrency_(currency) === 'KHR'
    ? number / EXCHANGE_RATE
    : number;
}

function round2_(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function getSubcategoryLabel_(category, subCategory) {
  if (
    SUBCATEGORY_LABELS[category] &&
    SUBCATEGORY_LABELS[category][subCategory]
  ) {
    return SUBCATEGORY_LABELS[category][subCategory];
  }
  return subCategory || '';
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────
// GOOGLE SHEETS MENU
// ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Finance Report')
    .addItem('Refresh Today Report', 'refreshDailyReport')
    .addItem('Test Expense Submission', 'testExpenseSubmission')
    .addToUi();
}

// ─────────────────────────────────────────────────────────────
// TEST
// ─────────────────────────────────────────────────────────────
function testExpenseSubmission() {
  const event = {
    postData: {
      contents: JSON.stringify({
        requestId: 'TEST-' + Date.now(),
        type: 'expense',
        category: 'household',
        subCategory: 'rice',
        payment: 'cash',
        currency: 'KHR',
        amount: 10000,
        note: 'ទិញអង្ករ'
      })
    }
  };

  console.log(doPost(event).getContent());
}
