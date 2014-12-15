#Init

Make sure you have [Bower](http://bower.io) and [Gulp](http://gulpjs.com) installed:

    $ npm install -g bower
    $ npm install -g gulp

Install dependencies:

    $ npm install
    $ bower install

#Develop

Build static files and run dev server:

    $ gulp

Copy build to GH-Pages folder. The setup should be `master` branch in `/projects/sapo.js` and `gh-pages` branch in `/projects/sapo.js-pages`. This command will copy `master` branch's `build` folder to `gh-pages` branch folder:

    $ gulp deploy