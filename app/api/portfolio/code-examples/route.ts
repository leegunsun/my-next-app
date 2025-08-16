import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase/config'
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore'
import { CodeExample } from '../../../../lib/types/portfolio'

export async function GET() {
  try {
    const codeExamplesCollection = collection(db, 'portfolio-code-examples')
    const q = query(codeExamplesCollection, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // Return default code examples if none exist
      const defaultCodeExamples: CodeExample[] = [
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
        }
      ]

      return NextResponse.json({
        success: true,
        data: defaultCodeExamples,
        message: 'Default code examples retrieved'
      })
    }

    const codeExamples = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CodeExample[]

    return NextResponse.json({
      success: true,
      data: codeExamples,
      message: 'Code examples retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching code examples:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch code examples'
    }, { status: 500 })
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

    const codeExamplesCollection = collection(db, 'portfolio-code-examples')
    const docRef = await addDoc(codeExamplesCollection, codeExampleData)
    const newCodeExample = { id: docRef.id, ...codeExampleData }

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