import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, PaperProvider, Text, TextInput } from 'react-native-paper';


const API_URL = 'http://192.168.0.7:5000';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');

  // Função para buscar as tarefas do backend
  const carregarTarefas = async () => {
    try {
      const response = await fetch(`${API_URL}/tarefas`);
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas. Verifique se o backend está rodando.');
    }
  };

  // Carrega as tarefas assim que o app abre
  useEffect(() => {
    carregarTarefas();
  }, []);

  // Função para adicionar uma nova tarefa (CREATE)
  const adicionarTarefa = async () => {
    if (!titulo.trim()) return;
    try {
      await fetch(`${API_URL}/tarefas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, concluida: false }),
      });
      setTitulo('');
      carregarTarefas(); // Atualiza a lista
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Função para marcar/desmarcar como concluída (UPDATE)
  const alternarConcluida = async (tarefa) => {
    try {
      await fetch(`${API_URL}/tarefas/${tarefa._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concluida: !tarefa.concluida }),
      });
      carregarTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  // Função para deletar uma tarefa (DELETE)
  const deletarTarefa = async (id) => {
    try {
      await fetch(`${API_URL}/tarefas/${id}`, { method: 'DELETE' });
      carregarTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a tarefa.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.titulo}>Minhas Tarefas</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Nova tarefa"
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={adicionarTarefa} style={styles.botao}>
            Adicionar
          </Button>
        </View>

        <FlatList
          data={tarefas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                               <Button 
                  mode="text" 
                  onPress={() => alternarConcluida(item)}
                  textColor={item.concluida ? '#4caf50' : '#6200ee'}
                >
                  {item.concluida ? 'Desfazer' : 'Concluir'}
                </Button>
                <Text style={[styles.textoTarefa, item.concluida && styles.concluida]}>
                  {item.titulo}
                </Text>
                <Button 
                  mode="text" 
                  onPress={() => deletarTarefa(item._id)}
                  textColor="red"
                >
                  Excluir
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  titulo: { marginTop: 40, marginBottom: 20, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, marginRight: 10, backgroundColor: '#fff' },
  botao: { justifyContent: 'center' },
  card: { marginBottom: 10 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  textoTarefa: { flex: 1, marginLeft: 10 },
  concluida: { textDecorationLine: 'line-through', color: '#888' },
});