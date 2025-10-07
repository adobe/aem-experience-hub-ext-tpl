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
const path = require('path');
const Generator = require('yeoman-generator');
const { execSync } = require('child_process');

module.exports = class extends Generator {

  async prompting() {
    this.answers = await this.prompt([
      { 
        type: 'input', 
        name: 'projectName', 
        message: 'Project name:', 
        default: path.basename(this.destinationRoot()) 
      }
    ]);
  }

  writing() {
    this.sourceRoot(path.resolve(__dirname, 'templates'));
    const { projectName } = this.answers;
    const finalDest = this.destinationRoot(); 

    this.fs.copyTpl(
      this.templatePath('**/*'), 
      this.destinationPath(),
      { projectName }, 
      undefined, 
      { globOptions: { dot: true } }
    );
    this.fs.copyTpl(
      this.templatePath('**/.*'), 
      this.destinationPath(),
      { projectName },
      undefined,
      { globOptions: { dot: true } }
    );
  }

  async end() {
    const dest = this.destinationRoot();
    this.log(`\nTemplates copied to: ${dest}\n`);

    try {
      execSync('npm install', { stdio: 'inherit', cwd: dest });
      execSync('npm install @adobe/uix-guest', { stdio: 'inherit', cwd: dest });
      execSync('npm install @adobe/aem-experience-hub-ext-tpl', { stdio: 'inherit', cwd: dest });
      this.log('\nDependencies installed.\n');
    } catch {
      this.log('\nnpm install failed. Please run manually.\n');
    }
  }
};
