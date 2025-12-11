import json
import os
from typing import Dict, Any, List
import spacy
import psycopg2
from psycopg2.extras import Json

nlp_fr = None
nlp_en = None

def get_nlp_model(language: str):
    """
    Загружает и кэширует spaCy модель для указанного языка
    """
    global nlp_fr, nlp_en
    
    if language == 'fr':
        if nlp_fr is None:
            nlp_fr = spacy.load('fr_core_news_sm')
        return nlp_fr
    elif language == 'en':
        if nlp_en is None:
            nlp_en = spacy.load('en_core_web_sm')
        return nlp_en
    else:
        raise ValueError(f'Unsupported language: {language}')

def get_pos_russian(pos: str, language: str) -> str:
    """
    Переводит часть речи на русский язык
    """
    pos_map = {
        'NOUN': 'Существительное',
        'VERB': 'Глагол',
        'ADJ': 'Прилагательное',
        'ADV': 'Наречие',
        'PRON': 'Местоимение',
        'ADP': 'Предлог',
        'CONJ': 'Союз',
        'CCONJ': 'Союз',
        'SCONJ': 'Союз',
        'DET': 'Артикль',
        'NUM': 'Числительное',
        'PART': 'Частица',
        'INTJ': 'Междометие',
        'AUX': 'Вспом. глагол',
        'PROPN': 'Имя собственное',
        'PUNCT': 'Пунктуация',
        'SYM': 'Символ',
        'X': 'Другое'
    }
    return pos_map.get(pos, pos)

def get_dependency_russian(dep: str) -> str:
    """
    Переводит синтаксическую роль на русский язык
    """
    dep_map = {
        'nsubj': 'Подлежащее',
        'obj': 'Дополнение',
        'iobj': 'Косвенное дополнение',
        'ROOT': 'Корень (сказуемое)',
        'det': 'Определитель',
        'amod': 'Определение',
        'advmod': 'Обстоятельство',
        'prep': 'Предлог',
        'pobj': 'Объект предлога',
        'aux': 'Вспомогательный глагол',
        'cc': 'Союз',
        'conj': 'Сочинительная связь',
        'punct': 'Пунктуация',
        'case': 'Падежный маркер',
        'nmod': 'Именной модификатор',
        'nummod': 'Числовой модификатор'
    }
    return dep_map.get(dep, dep)

def analyze_text_with_spacy(text: str, language: str) -> List[Dict[str, Any]]:
    """
    Анализирует текст с помощью spaCy и возвращает морфологический разбор
    """
    try:
        nlp = get_nlp_model(language)
    except Exception as e:
        raise ValueError(f'Failed to load spaCy model for {language}: {str(e)}')
    
    doc = nlp(text)
    
    analyzed_words = []
    
    for token in doc:
        word_data = {
            'word': token.text,
            'pos': token.pos_.lower(),
            'posRu': get_pos_russian(token.pos_, language),
            'lemma': token.lemma_,
            'syntaxRole': token.dep_.lower(),
            'syntaxRoleRu': get_dependency_russian(token.dep_)
        }
        
        if token.morph:
            morph_details = []
            
            if 'Gender' in token.morph:
                gender_map = {'Masc': 'муж.', 'Fem': 'жен.', 'Neut': 'ср.'}
                word_data['gender'] = gender_map.get(str(token.morph.get('Gender')[0]), str(token.morph.get('Gender')[0]))
            
            if 'Number' in token.morph:
                number_map = {'Sing': 'ед.', 'Plur': 'множ.'}
                word_data['number'] = number_map.get(str(token.morph.get('Number')[0]), str(token.morph.get('Number')[0]))
            
            if 'Person' in token.morph:
                person_map = {'1': '1-е лицо', '2': '2-е лицо', '3': '3-е лицо'}
                word_data['person'] = person_map.get(str(token.morph.get('Person')[0]), str(token.morph.get('Person')[0]))
            
            if 'Tense' in token.morph:
                tense_map = {'Past': 'прош.', 'Pres': 'наст.', 'Fut': 'буд.'}
                tense = tense_map.get(str(token.morph.get('Tense')[0]), str(token.morph.get('Tense')[0]))
                morph_details.append(tense)
            
            if 'Mood' in token.morph:
                mood_map = {'Ind': 'изъяв.', 'Imp': 'повел.', 'Sub': 'сослаг.'}
                mood = mood_map.get(str(token.morph.get('Mood')[0]), str(token.morph.get('Mood')[0]))
                morph_details.append(mood)
            
            if morph_details:
                word_data['details'] = ', '.join(morph_details)
        
        analyzed_words.append(word_data)
    
    return analyzed_words

def save_to_database(text: str, language: str, analyzed_data: List[Dict[str, Any]]):
    """
    Сохраняет результат анализа в базу данных
    """
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not found in environment')
    
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO analysis_history (text, language, analyzed_data) VALUES (%s, %s, %s)",
            (text, language, Json(analyzed_data))
        )
        conn.commit()
        cur.close()
    finally:
        conn.close()

def get_analysis_history(language: str = None, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Получает историю анализов из базы данных
    """
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not found in environment')
    
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        
        if language:
            query = "SELECT id, text, language, analyzed_data, created_at FROM analysis_history WHERE language = %s ORDER BY created_at DESC LIMIT %s"
            cur.execute(query, (language, limit))
        else:
            query = "SELECT id, text, language, analyzed_data, created_at FROM analysis_history ORDER BY created_at DESC LIMIT %s"
            cur.execute(query, (limit,))
        
        rows = cur.fetchall()
        cur.close()
        
        history = []
        for row in rows:
            history.append({
                'id': row[0],
                'text': row[1],
                'language': row[2],
                'analyzed_data': row[3],
                'created_at': row[4].isoformat() if row[4] else None
            })
        
        return history
    finally:
        conn.close()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обрабатывает запросы на анализ текста с помощью NLP (spaCy).
    Поддерживает французский и английский языки.
    Сохраняет результаты в базу данных и позволяет получить историю анализов.
    
    GET /history?language=fr&limit=10 - получить историю анализов
    POST / - анализировать новый текст
    Body: {"text": "Le chat mange", "language": "fr"}
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        language = params.get('language')
        limit = int(params.get('limit', '10'))
        
        history = get_analysis_history(language, limit)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'history': history}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        text = body.get('text', '').strip()
        language = body.get('language', 'fr')
        
        if not text:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Text is required'}),
                'isBase64Encoded': False
            }
        
        if language not in ['fr', 'en']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Unsupported language. Use "fr" or "en"'}),
                'isBase64Encoded': False
            }
        
        try:
            analyzed_words = analyze_text_with_spacy(text, language)
            save_to_database(text, language, analyzed_words)
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Analysis failed: {str(e)}'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'analyzed_words': analyzed_words,
                'text': text,
                'language': language
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }