// Github repo - https://github.com/akshaymarch7

// Example multiple routes techniques

Example: 1
app.use('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/hello', (req, res) => {
    res.send('Hello hello!');
});

If use '/' in the top then other routes below will see only '/' is there are not it will always print Hello word not hello


Exmaple: 2
app.use(/ab?c/, (req, res) => {
    res.send('Hello World!');
});

=> /abc, /ac - responce Hello World!

app.use(/ab+c/, (req, res) => {
    res.send('Hello World!');
});

=> /abc, /abbbbc/ - responce Hello World!

app.use(/ab*c/, (req, res) => {
    res.send('Hello World!');
});

=> /abc, /abjbcsjcjccc/ - responce Hello World!

app.use(/a(b)?c/, (req, res) => {
    res.send('Hello World!');
});

=> /abc, /ac/ - responce Hello World!
