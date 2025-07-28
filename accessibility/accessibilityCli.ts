#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync, realpathSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

class AccessibilityCLI {
	private currentBranch: string = '';
	private newBranch: string = '';

	constructor() {
		this.getCurrentBranch();
		this.generateBranchName();
	}

	private getCurrentBranch(): void {
		try {
			this.currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
				encoding: 'utf-8'
			}).trim();
			console.log(`📍 Current branch: ${this.currentBranch}`);
		} catch (error) {
			console.error('❌ Failed to get current branch. Are you in a git repository?');
			process.exit(1);
		}
	}

	private generateBranchName(): void {
		const timestamp = Date.now();
		this.newBranch = `accessibility-improvements-${timestamp}`;
	}

	private checkGeminiAuth(): void {
		try {
			execSync('gemini --version', { stdio: 'pipe' });
			console.log('✅ Gemini CLI available');
		} catch (error) {
			console.error('❌ Gemini CLI not found. Install with: npm install -g @google/gemini-cli');
			process.exit(1);
		}
	}

	private loadGuidelines(): string {
		try {
			const content = readFileSync('accessibility.md', 'utf-8');
			return content;
		} catch (error) {
			console.error('❌ Could not load access-info.md');
			process.exit(1);
		}
	}

	private createBranch(): void {
		try {
			console.log(`🌿 Creating new branch: ${this.newBranch}`);
			execSync(`git checkout -b ${this.newBranch}`, { stdio: 'inherit' });
		} catch (error) {
			console.error('❌ Failed to create new branch');
			process.exit(1);
		}
	}

	private findRelevantFiles(): string[] {
		try {
			const gitFiles = execSync('git ls-files', { encoding: 'utf-8' })
				.split('\n')
				.filter((file) => file.trim() && this.isRelevantFile(file));

			return gitFiles;
		} catch (error) {
			console.error('❌ Failed to get git files');
			return [];
		}
	}

	private isRelevantFile(fileName: string): boolean {
		const extensions = ['.svelte'];
		return extensions.some((ext) => fileName.endsWith(ext));
	}

	private async runAccessibilityCheck(file: string, guidelines: string): Promise<void> {
		if (!existsSync(file)) return;

		const PRTemplate = readFileSync('PR-template.md', 'utf-8');
		const PR = readFileSync('PR.md', 'utf-8');
		const fileContent = readFileSync(file, 'utf-8');
		const prompt = `Based on the following accessibility guidelines, please fix the issues in the provided code block. Only output the corrected code, with no other text, explanations, or markdown formatting. Do not change the content, functionality or visual output of any code, just make syntax accessibility improvements. If an accessibility issue such as color contrast, or moving elements does require content/output changes, write this information to the PR so that we can make those changes manually. After you have made changes to a file, write the changes to PR.md. Do not delete any of PR.md, just add to it. \n\nGuidelines:\n${guidelines}\n\nCode:\n${fileContent}\n\nPR template:\n${PRTemplate}`;

		try {
			console.log(`  Processing ${file}...`);
			// Pass the prompt via stdin to avoid shell syntax errors
			const fixedContent = execSync(`gemini --yolo`, {
				input: prompt,
				stdio: 'pipe',
				timeout: 90000 // timeout for generation
			}).toString();

			// Clean up the output to get only the code
			const codeBlock = fixedContent.match(/```html\n([\s\S]*?)\n```/);
			const finalContent = codeBlock ? codeBlock[1] : fixedContent;

			if (finalContent.trim()) {
				writeFileSync(file, finalContent);
				console.log(`  ✅ ${file}`);
			} else {
				console.log(`  ⚠️  Skipped ${file} (Gemini returned empty content)`);
			}
		} catch (error) {
			console.log(`  ⚠️  Skipped ${file}. Reason:`);
			console.error(error.stderr.toString());
		}
	}

	private commitChanges(): boolean {
		try {
			const status = execSync('git status --porcelain', { encoding: 'utf-8' });
			if (!status.trim()) {
				console.log('ℹ️  No changes to commit');
				return false;
			}

			console.log('📝 Committing changes...');
			execSync('git add .', { stdio: 'inherit' });
			execSync('git commit -m "feat: automated accessibility improvements via Gemini CLI"', {
				stdio: 'inherit'
			});
			return true;
		} catch (error) {
			console.error('❌ Failed to commit changes');
			return false;
		}
	}

	private pushBranch(): void {
		try {
			console.log('🚀 Pushing branch to remote...');
			execSync(`git push -u origin ${this.newBranch}`, { stdio: 'inherit' });
		} catch (error) {
			console.error('❌ Failed to push branch');
			process.exit(1);
		}
	}

	private createPR(): void {
		try {
			console.log('📋 Creating pull request...');
			const prBody = readFileSync('PR.md', 'utf-8');

			execSync(
				`gh pr create --title "Automated Accessibility Improvements (Gemini CLI)" --body-file PR.md --base ${this.currentBranch}`,
				{
					stdio: 'inherit'
				}
			);

			console.log('✅ Pull request created successfully!');
		} catch (error) {
			console.error('❌ Failed to create PR. Make sure GitHub CLI is installed and authenticated.');
		}
	}

	private switchBackToBranch(): void {
		try {
			console.log(`🔄 Switching back to ${this.currentBranch}`);
			execSync(`git checkout ${this.currentBranch}`, { stdio: 'inherit' });
		} catch (error) {
			console.log('⚠️  Could not switch back to original branch');
		}
	}

	public async run(): Promise<void> {
		console.log('🎯 Starting Gemini CLI Accessibility Tool...\n');

		this.checkGeminiAuth();

		const guidelines = this.loadGuidelines();
		console.log('📋 Loaded accessibility guidelines from access-info.md\n');

		const relevantFiles = this.findRelevantFiles();
		if (relevantFiles.length === 0) {
			console.log('🤷 No relevant files found to check.');
			return;
		}
		console.log(`🔎 Found ${relevantFiles.length} relevant files to check.`);

		this.createBranch();

		try {
			console.log(`🔧 Running accessibility checks...`);
			for (const file of relevantFiles) {
				await this.runAccessibilityCheck(file, guidelines);
			}

			const hasChanges = this.commitChanges();

			if (hasChanges) {
				this.pushBranch();
				this.createPR();
				console.log('\n🎉 Accessibility improvements completed!');
				console.log(`📊 Check your PR and merge when ready.`);
			} else {
				console.log('\n💡 No accessibility improvements needed at this time.');
			}
		} finally {
			this.switchBackToBranch();
		}
	}
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const cli = new AccessibilityCLI();
	cli.run().catch((error) => {
		console.error('💥 CLI failed:', error.message);
		process.exit(1);
	});
}

export default AccessibilityCLI;
