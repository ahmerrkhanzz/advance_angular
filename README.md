# Setup
## Git config
```
rm .git/config & cp dev/git/config .git/config
```

```
grunt git-hooks
```

## Bower
```
npm install -g bower
```

## JS unit tests
```
npm install -g karma-cli
```

## Build
```
npm install
```

```
bower install
```

```
grunt server
```

# Running App in development mode
```
grunt live
```


# Running JS tests

* quick tests

```
grunt test
```

* run tests & build report

```
grunt test-report
```

* run tests in debug mode

```
grunt test-debug
```


http://jasmine.github.io/2.4/introduction.html