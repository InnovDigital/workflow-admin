import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://hsktmxqpstdlvwfwikqt.supabase.co'
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhza3RteHFwc3RkbHZ3Zndpa3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDE1NDMsImV4cCI6MjA2MTc3NzU0M30.qgQyN5cuEFDXgRAQh_ohE1XGw41drORLM1ZVOuH6WRA'

if (!supabaseKey) {
  throw new Error('supabaseKey is required')
}

console.log(supabaseUrl, supabaseKey)
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function syncGedWorkflows(data = {}) {
  const response = await fetch(`${supabaseUrl}/functions/v1/sync_ged_workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      'Accept': 'application/json',
    
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error calling sync_ged_workflows: ' + response.statusText)
  }

  return await response.json()
}

export async function getGedWorkflows() {
    const { data, error } = await supabase
      .from('ged_workflows')
      .select('*')
      
    if (error) {
      throw new Error('Error fetching workflows: ' + error.message)
    }
  
    return data
}

export async function createWorkflow(data = {}) {
  const response = await fetch(`${supabaseUrl}/functions/v1/smooth-endpoint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error calling create_workflow: ' + response.statusText);
  }

  return await response.json();
}

export async function getWorkflowNodes(workflowId) {
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('workflow_id', workflowId)

  if (error) {
    throw new Error('Error fetching nodes: ' + error.message)
  }

  return data
}


export async function getNodeTypes() {
  const { data, error } = await supabase
    .from('node_types')
    .select('*')

  if (error) {
    throw new Error('Error fetching node types: ' + error.message)
  }

  return data
}

