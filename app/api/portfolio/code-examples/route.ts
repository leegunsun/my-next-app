import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, doc, getDocs, setDoc, orderBy, query } from 'firebase/firestore'
import { CodeExample } from '../../../../lib/types/portfolio'

// In-memory data store for code examples
let codeExamplesDataStore: CodeExample[] | null = null

// Default code examples data
const getDefaultCodeExamplesData = (): CodeExample[] => [
  {
    id: 'flutter-provider',
    title: 'Flutter Provider 패턴',
    language: 'dart',
    code: `class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  
  List<CartItem> get items => List.unmodifiable(_items);
  
  void addItem(Product product) {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );
    
    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(product: product, quantity: 1));
    }
    notifyListeners();
  }
  
  double get totalAmount => _items.fold(
    0.0, (sum, item) => sum + item.totalPrice,
  );
}`,
    description: 'Flutter에서 상태 관리를 위한 Provider 패턴 구현',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'spring-websocket',
    title: 'Spring Boot WebSocket 설정',
    language: 'kotlin',
    code: `@Configuration
@EnableWebSocket
class WebSocketConfig : WebSocketConfigurer {
    
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(NotificationHandler(), "/notifications")
            .setAllowedOrigins("*")
            .withSockJS()
    }
}

@Component
class NotificationHandler : TextWebSocketHandler() {
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    
    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions[session.id] = session
        logger.info("WebSocket connection established: {}", session.id)
    }
    
    fun broadcast(message: String) {
        sessions.values.forEach { session ->
            if (session.isOpen) {
                session.sendMessage(TextMessage(message))
            }
        }
    }
}`,
    description: 'Spring Boot에서 실시간 통신을 위한 WebSocket 설정',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'docker-compose',
    title: 'Docker Compose 다중 서비스 설정',
    language: 'yaml',
    code: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - DATABASE_URL=jdbc:postgresql://db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`,
    description: 'Docker Compose로 다중 서비스 환경 구성',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    const codeExamplesCollection = collection(db, 'portfolio-code-examples')
    const q = query(codeExamplesCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // If no data exists in Firestore, return default data
      const defaultData = getDefaultCodeExamplesData()
      
      return NextResponse.json({
        success: true,
        data: defaultData,
        message: 'Default code examples data retrieved (no data in database)'
      })
    }

    const codeExamples = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CodeExample[]
    
    return NextResponse.json({
      success: true,
      data: codeExamples,
      message: 'Code examples retrieved successfully from database'
    })
  } catch (error) {
    console.error('Error fetching code examples:', error)
    
    // Fallback to default data if Firebase fails
    const defaultData = getDefaultCodeExamplesData()
    return NextResponse.json({
      success: true,
      data: defaultData,
      message: 'Default code examples data retrieved (database error)'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const codeExampleData: Omit<CodeExample, 'id'> = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Generate new ID and create code example
    const newCodeExample: CodeExample = {
      id: Date.now().toString(),
      ...codeExampleData
    }

    // Initialize store if needed and add new code example
    if (!codeExamplesDataStore) {
      codeExamplesDataStore = getDefaultCodeExamplesData()
    }
    codeExamplesDataStore.push(newCodeExample)

    return NextResponse.json({
      success: true,
      data: newCodeExample,
      message: 'Code example created successfully'
    })
  } catch (error) {
    console.error('Error creating code example:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create code example'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedData: CodeExample[] = body

    // Clear existing data and save new data to Firestore
    const codeExamplesCollection = collection(db, 'portfolio-code-examples')
    
    // Save each code example to Firestore
    const savePromises = updatedData.map(example => {
      const exampleDocRef = doc(codeExamplesCollection, example.id)
      return setDoc(exampleDocRef, example)
    })
    
    await Promise.all(savePromises)

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Code examples saved successfully to database'
    })
  } catch (error) {
    console.error('Error updating code examples:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save code examples to database'
    }, { status: 500 })
  }
}