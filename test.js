fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test3@test.com', password: '123', name: 'Test' })
})
.then(async r => {
  const text = await r.text();
  console.log("Status:", r.status);
  console.log("Response:", text);
})
.catch(console.error);
