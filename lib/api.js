import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;


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

