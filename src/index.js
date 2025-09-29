/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const Generator = require('yeoman-generator');
const path = require('path');

class TheGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('dest-folder',  { type: String, default: '.' });
    this.option('project-name', { type: String, default: '' });

    this.props = {
      destFolder: this.options['dest-folder'],
      projectName: this.options['project-name']
    };
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'destFolder',
        message: 'Destination folder (use "." for current dir):',
        default: this.props.destFolder || this.appname.replace(/\s+/g, '-')
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: this.props.projectName || 'my-app'
      }
    ]);

    this.props.destFolder  = (answers.destFolder || '.').trim();
    this.props.projectName = (answers.projectName || '').trim();
  }

  async initializing() {
    this.sourceRoot(path.join(__dirname, './templates/'));
  }

  writing() {
    const destFolder = this.props.destFolder;

    if (destFolder !== '.') {
      this.destinationRoot(this.destinationPath(destFolder));
    }

    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      this.props,
      null,
      {
        globOptions: {
          dot: true,
          ignore: ['**/node_modules/**']
        },
        processDestinationPath: p => p.replace(/(^|\/)_([^/]+)/g, '$1.$2')
      }
    );
  }
  install() {
    if (this.options['skip-install']) return;
  
    this.spawnCommandSync('npm', ['install'], { cwd: this.destinationRoot() });
  
    this.spawnCommandSync('npm', ['install', '@adobe/uix-guest'], { cwd: this.destinationRoot() });
  }

  end() {
    this.log(`✅ Project ready at: ${this.destinationRoot()}`);
    this.log(`➡  Project name used: ${this.props.projectName}`);
  }
}

module.exports = TheGenerator;
