# volto-fullcalendar-block

## Develop

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://6.docs.plone.org/volto/getting-started/install.html)

1.  Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        npm install -g yo @plone/generator-volto mrs-developer

1.  Create new volto app

        yo @plone/volto my-volto-project --addon @mbarde/volto-fullcalendar-block --skip-install
        cd my-volto-project

1.  Add the following to `mrs.developer.json`:

        {
            "volto-fullcalendar-block": {
                "url": "https://github.com/mbarde/volto-fullcalendar-block.git",
                "package": "@mbarde/volto-fullcalendar-block",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install

        make develop
        make install

1.  Start backend

        docker pull plone
        docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone

    ...wait for backend to setup and start - `Ready to handle requests`:

        docker logs -f plone

    ...you can also check http://localhost:8080/Plone

1.  Start frontend

        yarn start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd src/addons/volto-fullcalendar-block/
