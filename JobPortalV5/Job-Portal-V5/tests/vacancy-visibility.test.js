const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const cases = [
  ['home', 'home/home.component.ts', 'PostData'],
  ['open jobs', 'dashboard/tabs/my-jobs/my-jobs.component.ts', 'getOpenVacancies'],
  ['applied jobs', 'dashboard/tabs/my-jobs/my-jobs.component.ts', 'getAppliedJobs'],
  ['chat', 'chatbox/chatbox.component.ts', 'getAppliedJobs']
];

function fixture(file, methodName) {
  const filename = path.join(__dirname, '../src/app/components', file);
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  const component = source.statements.find(statement => statement.kind === ts.SyntaxKind.ClassDeclaration);
  const method = component.members.find(member => member.name && member.name.text === methodName);
  assert.ok(method, `Missing ${methodName} in ${file}`);

  // Exercise the actual response handler without bootstrapping Angular or making API calls.
  const compiled = ts.transpileModule(`class Fixture { ${method.getText(source)} }\nFixture;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2017 }
  }).outputText;
  const Fixture = vm.runInNewContext(compiled, {
    navigator: { onLine: true },
    localStorage: { getItem: () => '100' },
    Constants: { Culture: 'en-GB', GetOpenVacancies: 'open', GetAppliedJobs: 'applied' },
    isNullOrUndefined: value => value === null || value === undefined,
    console
  });
  const instance = new Fixture();
  Object.assign(instance, {
    _config: { environment: { baseUrl: 'https://example.invalid/', CompanyGroupID: 'serena' } },
    dataService: { headers: {} },
    SelectedCompany: -1,
    HideOrganization: false,
    HideJobCode: false,
    HideTotalPositions: false,
    HideJobAttributeName: false,
    openSpinner() {},
    HideSpinner() {},
    autoOpenOfferLetterPopupIfNeeded() {}
  });

  return rows => {
    instance.http = { post: () => ({ subscribe: callback => callback({ Data: rows }) }) };
    instance[methodName]({}, 'https://example.invalid/open', {});
    return instance;
  };
}

function row(flags = {}) {
  return Object.assign({
    JobCode: '2-092026-03',
    JobStatus: '',
    ApplicantStatus: '',
    Offerletterissued: false,
    IsOfferRescinded: false,
    VisOrganization: null,
    VisJobCode: null,
    VisTotalPositions: null,
    AdditionalFilter: false
  }, flags);
}

for (const [name, file, method] of cases) {
  for (const flag of [true, false, null, undefined]) {
    test(`${name}: hide flags ${flag} follow the HR policy convention`, () => {
      const result = fixture(file, method)([row({
        VisOrganization: flag, VisJobCode: flag, VisTotalPositions: flag
      })]);
      assert.equal(result.HideOrganization, flag === true);
      assert.equal(result.HideJobCode, flag === true);
      assert.equal(result.HideTotalPositions, flag === true);
    });
    test(`${name}: AdditionalFilter ${flag} enables the attribute only when true`, () => {
      const result = fixture(file, method)([row({ AdditionalFilter: flag })]);
      assert.equal(result.HideJobAttributeName, flag === true);
    });
  }

  test(`${name}: Serena's false organization and null job-code policy stays visible`, () => {
    const result = fixture(file, method)([row({ VisOrganization: false })]);
    assert.equal(result.HideOrganization, false);
    assert.equal(result.HideJobCode, false);
    assert.equal(result.HideTotalPositions, false);
    assert.equal(result.HideJobAttributeName, false);
  });

  test(`${name}: mixed rows preserve the existing any-row policy aggregation`, () => {
    const result = fixture(file, method)([
      row(), row({ VisOrganization: true, VisJobCode: true, VisTotalPositions: true, AdditionalFilter: true })
    ]);
    assert.equal(result.HideOrganization, true);
    assert.equal(result.HideJobCode, true);
    assert.equal(result.HideTotalPositions, true);
    assert.equal(result.HideJobAttributeName, true);
  });
}

for (const [name, file, method] of cases.filter(([name]) => name === 'home' || name === 'chat')) {
  test(`${name}: refreshing or clearing results resets previous visibility flags`, () => {
    const run = fixture(file, method);
    run([row({ VisOrganization: true, VisJobCode: true, VisTotalPositions: true, AdditionalFilter: true })]);
    for (const rows of [[row()], []]) {
      const result = run(rows);
      assert.equal(result.HideOrganization, false);
      assert.equal(result.HideJobCode, false);
      assert.equal(result.HideTotalPositions, false);
      assert.equal(result.HideJobAttributeName, false);
    }
  });
}
