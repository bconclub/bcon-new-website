import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { execSync } from 'child_process';

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
}

export async function GET(request: NextRequest) {
  const errors: string[] = [];
  const startTime = Date.now();
  
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Get version - update this with each production push
  const version = 'v1.0';
  
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

  try {
    // Get commit hash
    try {
      gitInfo.commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git commit hash');
    }

    // Get commit message
    try {
      gitInfo.commitMessage = execSync('git log -1 --pretty=%s', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git commit message');
    }

    // Get author
    try {
      gitInfo.author = execSync('git log -1 --pretty=%an', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git author');
    }

    // Get author email
    try {
      gitInfo.authorEmail = execSync('git log -1 --pretty=%ae', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git author email');
    }

    // Get commit date
    try {
      gitInfo.commitDate = execSync('git log -1 --pretty=%aI', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git commit date');
    }

    // Get current branch
    try {
      gitInfo.branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git branch');
    }

    // Get remote URL
    try {
      gitInfo.remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
    } catch (e) {
      errors.push('Failed to get git remote URL');
    }
  } catch (error: any) {
    errors.push(`Git information error: ${error.message}`);
  }

  // Test database connection
  let dbStatus = {
    connected: false,
    status: 'unknown',
    error: undefined as string | undefined,
    responseTime: undefined as number | undefined,
  };

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

  const response: StatusResponse = {
    timestamp,
    git: gitInfo,
    database: dbStatus,
    errors,
    version,
  };

  // Return 200 even if there are errors, so the status page can display them
  return NextResponse.json(response, { status: 200 });
}

