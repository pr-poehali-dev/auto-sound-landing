import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def send_email_notification(phone: str) -> None:
    '''
    Sends email notification about new lead
    '''
    try:
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = os.environ.get('SMTP_PORT', '587')
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        notification_email = os.environ.get('NOTIFICATION_EMAIL')
        
        if not all([smtp_host, smtp_user, smtp_password, notification_email]):
            return
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = '🚗 Новая заявка на прайс-лист!'
        msg['From'] = smtp_user
        msg['To'] = notification_email
        
        html = f'''
        <html>
          <body style="font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #8b0000 100%); padding: 30px; border-radius: 10px;">
              <h2 style="color: #FFD700; margin: 0 0 20px 0;">🎯 Новый потенциальный клиент!</h2>
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p style="font-size: 18px; color: #333; margin: 10px 0;">
                  <strong>Телефон:</strong> <span style="color: #8b0000; font-size: 20px;">{phone}</span>
                </p>
                <p style="color: #666; margin: 10px 0;">Клиент скачал прайс-лист и готов к обсуждению!</p>
              </div>
            </div>
          </body>
        </html>
        '''
        
        part = MIMEText(html, 'html', 'utf-8')
        msg.attach(part)
        
        with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception:
        pass

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Saves customer phone numbers to database and returns all leads
    Args: event with httpMethod (POST to save, GET to retrieve), body with phone number
          context with request_id
    Returns: HTTP response with saved lead or list of all leads
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        phone = body_data.get('phone', '')
        
        if not phone or len(phone) < 10:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid phone number'})
            }
        
        cur.execute("INSERT INTO leads (phone) VALUES (%s) RETURNING id, phone, created_at", (phone,))
        row = cur.fetchone()
        conn.commit()
        
        result = {
            'id': row[0],
            'phone': row[1],
            'created_at': row[2].isoformat() if row[2] else None
        }
        
        cur.close()
        conn.close()
        
        send_email_notification(phone)
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    if method == 'GET':
        cur.execute("SELECT id, phone, created_at FROM leads ORDER BY created_at DESC")
        rows = cur.fetchall()
        
        leads = [
            {
                'id': row[0],
                'phone': row[1],
                'created_at': row[2].isoformat() if row[2] else None
            }
            for row in rows
        ]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'leads': leads})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }