import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface StatusResponse {
  timestamp: string;
  git: {
    commitHash: string;
    commitMessage: string;
    author: string;
    authorEmail: string;
    commitDate: string;
    branch: string;
    remoteUrl: string;
  };
  database: {
    connected: boolean;
    status: string;
    error?: string;
    responseTime?: number;
  };
  errors: string[];
  version: string;
  versionDate?: string;
}

export async function GET(request: NextRequest) {
  const errors: string[] = [];
  const startTime = Date.now();
  
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Get version from git tags (latest tag)
  let version = 'v1.00';
  let versionDate = timestamp;
  try {
    if (gitAvailable) {
      // Get the latest git tag
      try {
        const latestTag = execSync('git describe --tags --abbrev=0', { 
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000
        }).trim();
        version = latestTag;
        
        // Get the date of the tag
        try {
          const tagDate = execSync(`git log -1 --format=%aI ${latestTag}`, { 
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 5000
          }).trim();
          versionDate = tagDate;
        } catch {
          // If we can't get tag date, use current timestamp
          versionDate = timestamp;
        }
      } catch {
        // Fallback to package.json if git tags not available
        const packageJsonPath = join(process.cwd(), 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          version = `v${packageJson.version}`;
        }
      }
    } else {
      // Git not available, use package.json
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        version = `v${packageJson.version}`;
      }
    }
  } catch (error: any) {
    errors.push(`Failed to read version: ${error.message || 'Unknown error'}`);
  }
  
  // Get Git information
  let gitInfo = {
    commitHash: 'unknown',
    commitMessage: 'unknown',
    author: 'unknown',
    authorEmail: 'unknown',
    commitDate: 'unknown',
    branch: 'unknown',
    remoteUrl: 'unknown',
  };

  // Check if git is available and .git directory exists
  const gitAvailable = (() => {
    try {
      execSync('git --version', { 
        encoding: 'utf-8',
        stdio: 'ignore',
        timeout: 2000
      });
      // Check if .git directory exists
      return existsSync(join(process.cwd(), '.git'));
    } catch {
      return false;
    }
  })();

  // Try to get git info from environment variables first (set during build/deploy)
  if (process.env.NEXT_PUBLIC_GIT_COMMIT_HASH) {
    gitInfo.commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH;
  }
  if (process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE) {
    gitInfo.commitMessage = process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE;
  }
  if (process.env.NEXT_PUBLIC_GIT_BRANCH) {
    gitInfo.branch = process.env.NEXT_PUBLIC_GIT_BRANCH;
  }

  // Only try git commands if git is available
  if (gitAvailable) {
    try {
      // Get commit hash
      if (!process.env.NEXT_PUBLIC_GIT_COMMIT_HASH) {
        try {
          gitInfo.commitHash = execSync('git rev-parse HEAD', { 
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 5000
          }).trim();
        } catch (e: any) {
          errors.push(`Failed to get git commit hash: ${e.message || 'Unknown error'}`);
        }
      }

      // Get commit message
      if (!process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE) {
        try {
          gitInfo.commitMessage = execSync('git log -1 --pretty=%s', { 
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 5000
          }).trim();
        } catch (e: any) {
          errors.push(`Failed to get git commit message: ${e.message || 'Unknown error'}`);
        }
      }

      // Get author
      try {
        gitInfo.author = execSync('git log -1 --pretty=%an', { 
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000
        }).trim();
      } catch (e: any) {
        errors.push(`Failed to get git author: ${e.message || 'Unknown error'}`);
      }

      // Get author email
      try {
        gitInfo.authorEmail = execSync('git log -1 --pretty=%ae', { 
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000
        }).trim();
      } catch (e: any) {
        errors.push(`Failed to get git author email: ${e.message || 'Unknown error'}`);
      }

      // Get commit date
      try {
        gitInfo.commitDate = execSync('git log -1 --pretty=%aI', { 
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000
        }).trim();
      } catch (e: any) {
        errors.push(`Failed to get git commit date: ${e.message || 'Unknown error'}`);
      }

      // Get current branch
      if (!process.env.NEXT_PUBLIC_GIT_BRANCH) {
        try {
          gitInfo.branch = execSync('git branch --show-current', { 
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
            timeout: 5000
          }).trim();
        } catch (e: any) {
          errors.push(`Failed to get git branch: ${e.message || 'Unknown error'}`);
        }
      }

      // Get remote URL
      try {
        gitInfo.remoteUrl = execSync('git config --get remote.origin.url', { 
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000
        }).trim();
      } catch (e: any) {
        errors.push(`Failed to get git remote URL: ${e.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      errors.push(`Git information error: ${error.message}`);
    }
  } else {
    // Git not available - use defaults or environment variables
    if (!process.env.NEXT_PUBLIC_GIT_COMMIT_HASH) {
      gitInfo.commitHash = 'not available (git not in production)';
    }
    if (!process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE) {
      gitInfo.commitMessage = 'not available (git not in production)';
    }
    if (!process.env.NEXT_PUBLIC_GIT_BRANCH) {
      gitInfo.branch = 'production';
    }
    gitInfo.author = 'Build System';
    gitInfo.authorEmail = 'build@bconclub.com';
    gitInfo.commitDate = timestamp;
    gitInfo.remoteUrl = 'https://github.com/bconclub/bcon-new-website.git';
  }

  // Test database connection
  let dbStatus = {
    connected: false,
    status: 'unknown',
    error: undefined as string | undefined,
    responseTime: undefined as number | undefined,
  };

  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    dbStatus.connected = false;
    dbStatus.status = 'error';
    dbStatus.error = 'Supabase environment variables not configured. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.';
    errors.push('Database configuration error: Supabase environment variables are missing');
  } else {
    try {
      const dbStartTime = Date.now();
      const supabase = await createServerSupabaseClient();
      
      // Try a simple query to test connection
      const { data, error } = await supabase
        .from('work_items')
        .select('id')
        .limit(1);
      
      const dbEndTime = Date.now();
      dbStatus.responseTime = dbEndTime - dbStartTime;

      if (error) {
        dbStatus.connected = false;
        dbStatus.status = 'error';
        dbStatus.error = error.message;
        errors.push(`Database connection error: ${error.message}`);
      } else {
        dbStatus.connected = true;
        dbStatus.status = 'success';
      }
    } catch (error: any) {
      dbStatus.connected = false;
      dbStatus.status = 'error';
      dbStatus.error = error.message || 'Unknown database error';
      errors.push(`Database error: ${error.message || 'Unknown error'}`);
    }
  }

  const response: StatusResponse = {
    timestamp,
    git: gitInfo,
    database: dbStatus,
    errors,
    version,
    versionDate,
  };

  // Return 200 even if there are errors, so the status page can display them
  return NextResponse.json(response, { status: 200 });
}

