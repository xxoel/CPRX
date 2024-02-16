# HACKATON

## :scroll: Description
This directory stores the custom structure created for this challenge.

## :file_folder: Directory structure
```
. (base-dir)
├── codee
│   ├── XX
│   ├── README.md
│   └── tests
├── gradiant
│   └── XX
│   └── README.md
│   └── tests
├── CHANGELOG.md
└── README.md
└── LICENSE

```
Description of each directory:
* `codee`: directory with the definition, tests, specifications, and resources used in the image.
* `gradiant` (*Optional*): directory with files used in `Dockerfile`, for example `XX`.

Description of each file:
* `XX`: xx
* `xx`
* `test`: [structure-test](LINK) tests run on the created image to check settings.
* `XX`
* `CHANGELOG.md`
* `README.md`

## :crystal_ball: [Makefile](Makefile)
Using the `make` tool from this directory, you can compile, test, and deploy any of the available runtime images. This tool uses the [Makefile](Makefile) definition.

The following commands are available:
* `build`: build the image with its name and version.
* `test`: execute [container-structure-test](https://github.com/GoogleContainerTools/container-structure-test) tests in the image.
* `verify`: run `build` and `test` steps.
* `undeploy`: removes the current display from the image.
* `deploy`: run `undeploy` step and execute the image deployment definition.

Example of how to deploy an image:
```bash
SELF_RUNNER_NAME=example make deploy
```