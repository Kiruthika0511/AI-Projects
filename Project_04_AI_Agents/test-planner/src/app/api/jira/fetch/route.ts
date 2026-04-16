import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, email, token, ticketIds } = await request.json();

    if (!url || !email || !token || !ticketIds) {
      return NextResponse.json({ error: 'Missing Jira connection details or ticket IDs' }, { status: 400 });
    }

    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    
    // Split ticketIds by comma and trim
    const ids = ticketIds.split(',').map((id: string) => id.trim()).filter(Boolean);
    const issues = [];

    // Strip trailing slash from URL if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    for (const id of ids) {
      try {
        // Use v2 API to get simple string description instead of ADF
        const v2Res = await fetch(`${cleanUrl}/rest/api/2/issue/${id}`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });
        
        if (v2Res.ok) {
            const v2Data = await v2Res.json();
            issues.push({
                id: v2Data.key,
                summary: v2Data.fields.summary,
                status: v2Data.fields.status?.name || 'Unknown',
                description: v2Data.fields.description || 'No description provided.',
                type: v2Data.fields.issuetype?.name || 'Story'
            });
        } else {
           console.warn(`Failed to fetch ${id}: ${v2Res.status}`);
           // Push a placeholder issue as an error indicator
           issues.push({
             id: id,
             summary: `Failed to fetch (Status: ${v2Res.status}). Verify ticket ID and access.`,
             status: 'Error',
             description: 'N/A',
             type: 'Error'
           });
        }
      } catch(e) {
         issues.push({
             id: id,
             summary: `Connection error fetching ticket.`,
             status: 'Error',
             description: 'N/A',
             type: 'Error'
         });
      }
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Jira fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues.' }, { status: 500 });
  }
}
