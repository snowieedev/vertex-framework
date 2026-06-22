

const BASE_URL = 'http://localhost:3000';
let sessionCookie = '';

async function runTests() {
  const results = [];

  const logResult = (name, success, error) => {
    results.push({ name, success, error });
    if (success) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name} - FAILED: ${error}`);
    }
  };

  try {
    // 1. Visit /tests and ensure all links render
    let res = await fetch(`${BASE_URL}/tests`);
    let html = await res.text();
    let pass = html.includes('Vertex Phase 3 Test Suite') && html.includes('/tests/loader');
    logResult('Visit /tests', pass, pass ? '' : 'Index page did not load correctly.');

    // 2. Test Loader
    res = await fetch(`${BASE_URL}/tests/loader`);
    html = await res.text();
    pass = html.includes('"status": "Loader Working"');
    logResult('Test Loader', pass, pass ? '' : 'Loader did not return expected data.');

    // 3. Test Action
    res = await fetch(`${BASE_URL}/tests/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'testInput=ActionTest123'
    });
    html = await res.text();
    pass = html.includes('ActionTest123');
    logResult('Test Action', pass, pass ? '' : 'Action did not echo back the submitted value.');

    // 4. Test FormData
    res = await fetch(`${BASE_URL}/tests/form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'name=VertexTest&email=test@example.com'
    });
    html = await res.text();
    pass = html.includes('"name": "VertexTest"') && html.includes('"email": "test@example.com"');
    logResult('Test FormData', pass, pass ? '' : 'FormData was not parsed properly.');

    // 5. Test Route Params
    res = await fetch(`${BASE_URL}/tests/params/123`);
    html = await res.text();
    pass = html.includes('>123<');
    logResult('Test Route Params', pass, pass ? '' : 'Route param 123 was not displayed.');

    // 6. Test Search Params
    res = await fetch(`${BASE_URL}/tests/search?page=2&sort=name`);
    html = await res.text();
    pass = html.includes('>2<') && html.includes('>name<') || (html.includes('2') && html.includes('name') && html.includes('Page:') && html.includes('Sort:'));
    logResult('Test Search Params', pass, pass ? '' : 'Search params were not displayed properly.');

    // 7. Test Cookies
    res = await fetch(`${BASE_URL}/tests/cookies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'intent=set',
      redirect: 'manual'
    });
    let setCookie = res.headers.get('set-cookie');
    pass = setCookie && setCookie.includes('theme=dark');
    if (pass) {
      res = await fetch(`${BASE_URL}/tests/cookies`, {
        headers: { 'Cookie': setCookie.split(';')[0] }
      });
      html = await res.text();
      pass = html.includes('dark');
    }
    logResult('Test Cookies', pass, pass ? '' : 'Cookies were not set or read correctly.');

    // 8. Test Sessions
    res = await fetch(`${BASE_URL}/tests/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'intent=login',
      redirect: 'manual'
    });
    setCookie = res.headers.get('set-cookie');
    pass = !!setCookie;
    if (pass) {
      res = await fetch(`${BASE_URL}/tests/sessions`, {
        headers: { 'Cookie': setCookie.split(';')[0] }
      });
      html = await res.text();
      pass = html.includes('Vertex Tester');
    }
    logResult('Test Sessions', pass, pass ? '' : 'Session was not maintained.');

    // 9. Test Redirect
    res = await fetch(`${BASE_URL}/tests/redirect`, {
      method: 'POST',
      redirect: 'manual'
    });
    pass = res.status === 302 && (res.headers.get('location') === '/tests/success' || res.headers.get('location').includes('/tests/success'));
    logResult('Test Redirect', pass, pass ? '' : 'Redirect did not return 302 to success page.');

    // 10. Test Error Boundary
    res = await fetch(`${BASE_URL}/tests/error-boundary`);
    html = await res.text();
    pass = html.includes('Error Boundary Working') && html.includes('Testing Error Boundary');
    logResult('Test Error Boundary', pass, pass ? '' : 'Error boundary UI did not render the thrown error. Check server logs.');

    // 11. Test CRUD
    res = await fetch(`${BASE_URL}/tests/crud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'intent=add&text=CRUDTask1'
    });
    html = await res.text();
    pass = html.includes('CRUDTask1');
    
    if (pass) {
      // Find the ID. We can extract it roughly from the HTML.
      // <input type="hidden" name="id" value="xxxxx" />
      const idMatch = html.match(/name="id" value="([^"]+)"/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        res = await fetch(`${BASE_URL}/tests/crud`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `intent=delete&id=${id}`
        });
        html = await res.text();
        pass = !html.includes('CRUDTask1');
      } else {
        pass = false;
      }
    }
    logResult('Test CRUD', pass, pass ? '' : 'CRUD add or delete failed without API.');

  } catch (err) {
    console.error('Test execution failed:', err);
  }

  const allPassed = results.every(r => r.success);
  if (allPassed) {
    console.log('\nAll 11 tests passed! Phase 3 functionally complete.');
  } else {
    console.log('\nSome tests failed.');
  }
}

runTests();
